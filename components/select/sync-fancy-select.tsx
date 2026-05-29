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
  defaultValue?: string | null; // ✅ Novo atributo
}

export interface AsyncFancySelectProps
  extends AsyncSelectConfig, AsyncSelectUI {
  error?: string;
  className?: string;
  value?: string | null;
  onChange?: (value: string | null, rawData?: unknown) => void;
  onSearch?: (searchTerm: string) => void;
}

export interface FormAsyncFancySelectProps<
  TFieldValues extends FieldValues = FieldValues,
>
  extends AsyncSelectConfig, AsyncSelectUI {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACÇÃO DE ARRAY
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
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

interface UseAsyncFancySelectOptions extends AsyncSelectConfig {
  searchable?: boolean;
  disabled?: boolean;
  value?: string | null;
  defaultValue?: string | null;
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
  defaultValue,
  onChange,
  onLoad,
  onError,
  onSearch: onSearchCallback,
}: UseAsyncFancySelectOptions) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [internalValue, setInternalValue] = React.useState<string | null>(
    () => {
      if (externalValue !== undefined) return externalValue;
      if (defaultValue !== undefined) return defaultValue;
      return null;
    },
  );
  const [options, setOptions] =
    React.useState<AsyncSelectOption[]>(staticOptions);
  const [loading, setLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const selectRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Sincronização com value controlado
  React.useEffect(() => {
    if (externalValue !== undefined) setInternalValue(externalValue);
  }, [externalValue]);

  // Carregar opções
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
    [endpoint, method, valueField, displayField, searchField, disabled],
  );

  React.useEffect(() => {
    if (!disabled) loadOptions();
  }, [loadOptions, disabled]);

  // Aplicar defaultValue automaticamente quando as opções estiverem disponíveis
  React.useEffect(() => {
    if (
      defaultValue &&
      externalValue === undefined &&
      internalValue === defaultValue &&
      options.length > 0 &&
      !options.find((o) => o.value === defaultValue)
    ) {
      // Se defaultValue não existe nas opções, redefinir
      setInternalValue(null);
      onChange?.(null, null);
      return;
    }

    if (
      defaultValue &&
      externalValue === undefined &&
      internalValue === null &&
      options.length > 0
    ) {
      const matchedOption = options.find((o) => o.value === defaultValue);
      if (matchedOption && !matchedOption.disabled) {
        setInternalValue(defaultValue);
        onChange?.(defaultValue, matchedOption.raw);
      }
    }
  }, [defaultValue, externalValue, internalValue, options, onChange]);

  // Debounce de pesquisa
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

  // Filtro local
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm || (searchable && searchField)) return options;
    const lower = searchTerm.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(lower));
  }, [options, searchTerm, searchable, searchField]);

  const selectedOption = options.find((o) => o.value === internalValue) ?? null;

  const handleSelect = React.useCallback(
    (option: AsyncSelectOption) => {
      if (disabled || option.disabled) return;
      const next = internalValue === option.value ? null : option.value;
      setInternalValue(next);
      onChange?.(next, option.raw);
      setIsOpen(false);
      setSearchTerm("");
    },
    [disabled, internalValue, onChange],
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      setInternalValue(null);
      onChange?.(null, null);
      setIsOpen(false);
    },
    [disabled, onChange],
  );

  const toggleOpen = React.useCallback(() => {
    if (!disabled && !loading) setIsOpen((v) => !v);
  }, [disabled, loading]);

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
// ESTILOS (shadcn/ui)
// ─────────────────────────────────────────────────────────────────────────────

const SIZE_STYLES = {
  sm: { trigger: "h-8 px-2 text-xs", icon: 14 },
  md: { trigger: "h-10 px-3 text-sm", icon: 16 },
  lg: { trigger: "h-12 px-4 text-base", icon: 18 },
} as const;

const VARIANT_STYLES = {
  default: "",
  outline: "border-2",
  ghost: "border-transparent shadow-none hover:bg-accent",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DROPDOWN CONTENT
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
      className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-md animate-in fade-in zoom-in-95"
    >
      {searchable && (
        <div className="flex items-center border-b border-border px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar…"
            aria-label="Pesquisar opções"
            className="flex h-10 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-h-60 overflow-y-auto overscroll-contain">
        {loading && filteredOptions.length === 0 && (
          <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            <span>A carregar…</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-2 px-3 py-6 text-sm text-destructive">
            <div className="flex items-center gap-1.5">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={onReload}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <RefreshCw size={11} />
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && filteredOptions.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            {searchTerm ? "Nenhuma opção encontrada" : "Sem dados disponíveis"}
          </p>
        )}

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
                "relative flex w-full cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                option.disabled && "pointer-events-none opacity-50",
                isSelected && "bg-accent text-accent-foreground",
              )}
            >
              <span className="flex items-center gap-2 flex-1 min-w-0">
                {option.icon && (
                  <span className="shrink-0 text-muted-foreground">
                    {option.icon}
                  </span>
                )}
                <span className="truncate">{option.label}</span>
              </span>
              {isSelected && <Check size={iconSize - 2} className="shrink-0" />}
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
  value,
  defaultValue,
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
    defaultValue,
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
      {label && (
        <label
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            required &&
              "after:ml-0.5 after:text-destructive after:content-['*']",
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={toggleOpen}
          disabled={disabled || loading}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={cn(
            "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            triggerSize,
            VARIANT_STYLES[variant],
            hasError && "border-destructive focus:ring-destructive",
            !disabled &&
              !hasError &&
              "hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <span
            className={cn(
              "flex-1 truncate text-left",
              !selectedOption && "text-muted-foreground",
            )}
          >
            {loading && !selectedOption ? (
              <span className="flex items-center gap-2">
                <Loader2 size={iconSize} className="animate-spin" />A carregar…
              </span>
            ) : (
              (selectedOption?.label ?? placeholder)
            )}
          </span>

          <span className="flex items-center gap-1 shrink-0">
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
                className="rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X size={iconSize - 2} />
              </span>
            )}
            <ChevronDown
              size={iconSize}
              className={cn(
                "text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </span>
        </button>

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

      {(displayError || helperText) && (
        <p
          className={cn(
            "text-xs flex items-center gap-1",
            hasError ? "text-destructive" : "text-muted-foreground",
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
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  name,
  required,
  defaultValue,
  ...rest
}: FormAsyncFancySelectProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? "Este campo é obrigatório" : undefined },
    // Converte null para undefined e passa o valor (com type assertion)
    defaultValue:
      defaultValue !== undefined ? (defaultValue as any) : undefined,
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
