"use client";

import * as React from "react";
import {
  ChevronDown,
  Check,
  X,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import { z } from "zod";
import { api } from "@/src/services/api";
import { AxiosRequestConfig } from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA & TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const asyncSelectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().optional(),
  icon: z.any().optional(),
  raw: z.any().optional(),
});

export type AsyncSelectOption = z.infer<typeof asyncSelectOptionSchema>;

// Tipos base reutilizáveis entre as duas interfaces públicas
interface AsyncSelectConfig {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  axiosConfig?: AxiosRequestConfig;
  displayField: string;
  valueField: string;
  searchField?: string;
  searchDelay?: number;
  extraParams?: Record<string, unknown>;
  transformResponse?: (data: unknown[]) => unknown[];
  staticOptions?: AsyncSelectOption[];
  onLoad?: (options: AsyncSelectOption[]) => void;
  onError?: (error: unknown) => void;
}

interface AsyncSelectUI {
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  helperText?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export interface AsyncFancySelectProps
  extends AsyncSelectConfig,
    AsyncSelectUI {
  error?: string;
  className?: string;
  value?: string | null;
  onChange?: (value: string | null, rawData?: unknown) => void;
  onSearch?: (searchTerm: string) => void;
}

export interface FormAsyncFancySelectProps<
  TFieldValues extends FieldValues = FieldValues
> extends AsyncSelectConfig,
    AsyncSelectUI {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACÇÃO DE ARRAY — normaliza respostas paginadas e simples
// ─────────────────────────────────────────────────────────────────────────────

const ARRAY_KEYS = ["items", "results", "data", "records"] as const;

function extractArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    for (const key of ARRAY_KEYS) {
      const val = (data as Record<string, unknown>)[key];
      if (Array.isArray(val)) return val;
    }
    return [data];
  }
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — toda a lógica isolada e testável
// ─────────────────────────────────────────────────────────────────────────────

interface UseAsyncFancySelectOptions extends AsyncSelectConfig {
  searchable?: boolean;
  disabled?: boolean;
  value?: string | null;
  onChange?: (value: string | null, rawData?: unknown) => void;
  onSearch?: (searchTerm: string) => void;
}

function useAsyncFancySelect({
  endpoint,
  method = "GET",
  axiosConfig = {},
  displayField,
  valueField,
  searchField,
  searchDelay = 300,
  extraParams = {},
  transformResponse,
  staticOptions = [],
  searchable = false,
  disabled = false,
  value: externalValue,
  onChange,
  onLoad,
  onError,
  onSearch: onSearchCallback,
}: UseAsyncFancySelectOptions) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [internalValue, setInternalValue] = React.useState<string | null>(
    externalValue ?? null
  );
  const [options, setOptions] =
    React.useState<AsyncSelectOption[]>(staticOptions);
  const [loading, setLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const selectRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Sincronização controlada (evita loop infinito com deps estáveis)
  React.useEffect(() => {
    if (externalValue !== undefined) setInternalValue(externalValue ?? null);
  }, [externalValue]);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const loadOptions = React.useCallback(
    async (search?: string) => {
      if (disabled) return;
      setLoading(true);
      setFetchError(null);

      try {
        const params: Record<string, unknown> = { ...extraParams };
        if (search) {
          params[searchField ?? "search"] = search;
        }

        const isWrite = method !== "GET";
        const response = await api.request({
          method,
          url: endpoint,
          params: !isWrite ? params : undefined,
          data: isWrite ? params : undefined,
          ...axiosConfig,
        });

        let raw = extractArray(response.data);
        if (transformResponse) raw = transformResponse(raw);

        const mapped: AsyncSelectOption[] = raw.map((item) => {
          const record = item as Record<string, unknown>;
          return {
            value: String(record[valueField] ?? ""),
            label: String(record[displayField] ?? ""),
            disabled: Boolean(record.disabled),
            icon: record.icon,
            raw: item,
          };
        });

        const merged = [...staticOptions, ...mapped];
        setOptions(merged);
        onLoad?.(merged);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar dados";
        setFetchError(message);
        onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endpoint, method, valueField, displayField, searchField, disabled]
    // Nota: extraParams, axiosConfig, staticOptions, transformResponse excluídos
    // intencionalmente — devem ser memoizados pelo consumidor (useMemo/useCallback)
    // para evitar re-fetches infinitos.
  );

  // Carga inicial
  React.useEffect(() => {
    if (!disabled) loadOptions();
  }, [loadOptions, disabled]);

  // Busca com debounce — só activo quando searchField está definido
  React.useEffect(() => {
    if (!searchable || !searchField) return;

    const timer = setTimeout(() => {
      loadOptions(searchTerm || undefined);
      if (searchTerm) onSearchCallback?.(searchTerm);
    }, searchDelay);

    return () => clearTimeout(timer);
  }, [
    searchTerm,
    searchable,
    searchField,
    searchDelay,
    loadOptions,
    onSearchCallback,
  ]);

  // Filtro local (quando não há busca na API)
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm || (searchable && searchField)) return options;
    const lower = searchTerm.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(lower));
  }, [options, searchTerm, searchable, searchField]);

  const selectedOption = options.find((o) => o.value === internalValue) ?? null;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelect = React.useCallback(
    (option: AsyncSelectOption) => {
      if (disabled || option.disabled) return;
      const next = internalValue === option.value ? null : option.value;
      setInternalValue(next);
      onChange?.(next, option.raw);
      setIsOpen(false);
      setSearchTerm("");
    },
    [disabled, internalValue, onChange]
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      setInternalValue(null);
      onChange?.(null, null);
      setIsOpen(false);
    },
    [disabled, onChange]
  );

  const toggleOpen = React.useCallback(() => {
    if (!disabled && !loading) setIsOpen((v) => !v);
  }, [disabled, loading]);

  // Fechar ao clicar fora
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Foco no input ao abrir
  React.useEffect(() => {
    if (isOpen && searchable) {
      const id = setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => clearTimeout(id);
    }
  }, [isOpen, searchable]);

  return {
    isOpen,
    toggleOpen,
    searchTerm,
    setSearchTerm,
    internalValue,
    selectedOption,
    filteredOptions,
    loading,
    fetchError,
    handleSelect,
    handleClear,
    selectRef,
    searchInputRef,
    reloadOptions: () => loadOptions(),
    options,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS CONSTANTES (fora do render para evitar recriação)
// ─────────────────────────────────────────────────────────────────────────────

const SIZE_STYLES = {
  sm: { trigger: "py-1.5 px-3 text-sm", icon: 14 },
  md: { trigger: "py-2 px-3 text-base", icon: 16 },
  lg: { trigger: "py-3 px-4 text-lg", icon: 18 },
} as const;

const VARIANT_STYLES = {
  default:
    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
  outline:
    "bg-transparent border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
  ghost:
    "bg-transparent border border-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTES
// ─────────────────────────────────────────────────────────────────────────────

interface DropdownContentProps {
  loading: boolean;
  error: string | null;
  searchable: boolean;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  filteredOptions: AsyncSelectOption[];
  selectedValue: string | null;
  onSelect: (o: AsyncSelectOption) => void;
  onReload: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  iconSize: number;
}

const DropdownContent = React.memo(function DropdownContent({
  loading,
  error,
  searchable,
  searchTerm,
  onSearchChange,
  filteredOptions,
  selectedValue,
  onSelect,
  onReload,
  searchInputRef,
  iconSize,
}: DropdownContentProps) {
  return (
    <div
      role="listbox"
      aria-label="Opções disponíveis"
      className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      {searchable && (
        <div className="p-2 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Pesquisar…"
              aria-label="Pesquisar opções"
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="max-h-60 overflow-y-auto overscroll-contain" role="group">
        {/* Estado: carregando */}
        {loading && filteredOptions.length === 0 && (
          <div className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-gray-400">
            <Loader2 size={14} className="animate-spin" />
            <span>A carregar…</span>
          </div>
        )}

        {/* Estado: erro */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-2 px-3 py-4 text-sm text-red-500">
            <div className="flex items-center gap-1.5">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={onReload}
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition"
            >
              <RefreshCw size={11} />
              Tentar novamente
            </button>
          </div>
        )}

        {/* Estado: vazio */}
        {!loading && !error && filteredOptions.length === 0 && (
          <p className="px-3 py-4 text-sm text-center text-gray-400">
            {searchTerm ? "Nenhuma opção encontrada" : "Sem dados disponíveis"}
          </p>
        )}

        {/* Lista de opções */}
        {filteredOptions.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              disabled={option.disabled}
              onClick={() => onSelect(option)}
              className={cn(
                "w-full px-3 py-2 text-left flex items-center justify-between gap-2 transition-colors duration-100",
                "hover:bg-gray-50 dark:hover:bg-gray-800",
                option.disabled && "opacity-40 cursor-not-allowed",
                isSelected &&
                  "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
              )}
            >
              <span className="flex items-center gap-2 flex-1 min-w-0">
                {option.icon && (
                  <span className="text-gray-400 shrink-0">{option.icon}</span>
                )}
                <span className="text-sm truncate">{option.label}</span>
              </span>
              {isSelected && (
                <Check size={iconSize - 2} className="shrink-0 text-blue-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export function AsyncFancySelect({
  // API
  endpoint,
  method = "GET",
  axiosConfig = {},
  displayField,
  valueField,
  searchField,
  searchDelay = 300,
  extraParams = {},
  transformResponse,
  staticOptions = [],
  // UI
  placeholder = "Seleccionar…",
  searchable = false,
  clearable = false,
  disabled = false,
  size = "md",
  variant = "default",
  error: externalError,
  className,
  label,
  required,
  helperText,
  // Callbacks
  value,
  onChange,
  onLoad,
  onError,
  onSearch,
}: AsyncFancySelectProps) {
  const {
    isOpen,
    toggleOpen,
    searchTerm,
    setSearchTerm,
    selectedOption,
    filteredOptions,
    loading,
    fetchError,
    handleSelect,
    handleClear,
    selectRef,
    searchInputRef,
    reloadOptions,
  } = useAsyncFancySelect({
    endpoint,
    method,
    axiosConfig,
    displayField,
    valueField,
    searchField,
    searchDelay,
    extraParams,
    transformResponse,
    staticOptions,
    searchable,
    disabled,
    value,
    onChange,
    onLoad,
    onError,
    onSearch,
  });

  const displayError = externalError ?? fetchError;
  const { trigger: triggerSize, icon: iconSize } = SIZE_STYLES[size];
  const hasError = Boolean(displayError);

  return (
    <div className={cn("w-full space-y-1.5", className)} ref={selectRef}>
      {/* Label */}
      {label && (
        <label
          className={cn(
            "block text-sm font-medium text-gray-700 dark:text-gray-300",
            required && "after:content-['*'] after:ml-0.5 after:text-red-500"
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={toggleOpen}
          disabled={disabled || loading}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={cn(
            "relative w-full text-left rounded-lg transition-all duration-200",
            "flex items-center justify-between gap-2",
            triggerSize,
            VARIANT_STYLES[variant],
            !disabled &&
              !hasError &&
              "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent",
            disabled &&
              "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800",
            hasError && "border-red-500 focus-visible:ring-red-500"
          )}
        >
          <span
            className={cn(
              "flex-1 truncate",
              !selectedOption && "text-gray-400 dark:text-gray-500"
            )}
          >
            {loading && !selectedOption ? (
              <span className="flex items-center gap-2 text-gray-400">
                <Loader2 size={iconSize} className="animate-spin" />A carregar…
              </span>
            ) : (
              selectedOption?.label ?? placeholder
            )}
          </span>

          <span className="flex items-center gap-1 shrink-0">
            {/* Botão limpar */}
            {clearable && selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Limpar selecção"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClear(e as unknown as React.MouseEvent);
                  }
                }}
                className="p-0.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <X size={iconSize - 2} />
              </span>
            )}
            <ChevronDown
              size={iconSize}
              className={cn(
                "transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </span>
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <DropdownContent
            loading={loading}
            error={fetchError}
            searchable={searchable}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filteredOptions={filteredOptions}
            selectedValue={selectedOption?.value ?? null}
            onSelect={handleSelect}
            onReload={reloadOptions}
            searchInputRef={searchInputRef}
            iconSize={iconSize}
          />
        )}
      </div>

      {/* Mensagem de erro ou helper */}
      {(displayError || helperText) && (
        <p
          className={cn(
            "text-xs flex items-center gap-1",
            hasError ? "text-red-500" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {hasError && <AlertCircle size={11} />}
          {displayError ?? helperText}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VERSÃO REACT HOOK FORM
// ─────────────────────────────────────────────────────────────────────────────

export function FormAsyncFancySelect<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  required,
  ...rest
}: FormAsyncFancySelectProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? "Este campo é obrigatório" : undefined },
  });

  return (
    <AsyncFancySelect
      {...rest}
      required={required}
      value={field.value as string | null}
      onChange={(value) => field.onChange(value)}
      error={error?.message}
    />
  );
}
