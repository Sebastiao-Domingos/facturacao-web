// components/ui/fancy-select.tsx
"use client";

import * as React from "react";
import { ChevronDown, Check, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import { z } from "zod";

// Schema para validação
export const selectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().optional(),
  icon: z.any().optional(),
});

export type SelectOption = z.infer<typeof selectOptionSchema>;

interface FancySelectProps {
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  className?: string;
  onChange?: (value: string | null) => void;
  value?: string | null;
  label?: string;
  required?: boolean;
  helperText?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

interface FormFancySelectProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  required?: boolean;
  helperText?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

// Hook personalizado para gerenciar estado do select
function useFancySelect({
  options,
  searchable = false,
  clearable = false,
  disabled = false,
  onChange,
  value: externalValue,
}: Omit<
  FancySelectProps,
  | "placeholder"
  | "loading"
  | "error"
  | "className"
  | "label"
  | "required"
  | "helperText"
  | "size"
  | "variant"
> & {
  onChange?: (value: string | null) => void;
  value?: string | null;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [internalValue, setInternalValue] = React.useState<string | null>(
    externalValue || null
  );
  const selectRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Sincronizar valor externo
  React.useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  // Filtrar opções baseado no search
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const selectedOption = options.find((opt) => opt.value === internalValue);

  const handleSelect = (value: string) => {
    if (disabled) return;
    const newValue = internalValue === value ? null : value;
    setInternalValue(newValue);
    onChange?.(newValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    setInternalValue(null);
    onChange?.(null);
    setIsOpen(false);
  };

  // Fechar ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focar no input quando abrir
  React.useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, searchable]);

  return {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    internalValue,
    selectedOption,
    filteredOptions,
    handleSelect,
    handleClear,
    selectRef,
    searchInputRef,
  };
}

// Componente principal
export function FancySelect({
  options,
  placeholder = "Selecione...",
  searchable = false,
  clearable = false,
  disabled = false,
  loading = false,
  error,
  className,
  onChange,
  value,
  label,
  required,
  helperText,
  size = "md",
  variant = "default",
}: FancySelectProps) {
  const {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    selectedOption,
    filteredOptions,
    handleSelect,
    handleClear,
    selectRef,
    searchInputRef,
  } = useFancySelect({
    options,
    searchable,
    clearable,
    disabled,
    onChange,
    value,
  });

  // Estilos baseados no tamanho
  const sizeStyles = {
    sm: "py-1.5 text-sm",
    md: "py-2 text-base",
    lg: "py-3 text-lg",
  };

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const variantStyles = {
    default: cn(
      "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
      "hover:border-gray-300 dark:hover:border-gray-600",
      !disabled &&
        "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
    ),
    outline: cn(
      "bg-transparent border-2 border-gray-300 dark:border-gray-600",
      "hover:border-gray-400 dark:hover:border-gray-500",
      !disabled &&
        "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
    ),
    ghost: cn(
      "bg-transparent border border-transparent",
      "hover:bg-gray-100 dark:hover:bg-gray-800"
    ),
  };

  return (
    <div className={cn("w-full space-y-1.5", className)} ref={selectRef}>
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
        {/* Botão do select */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={cn(
            "relative w-full text-left rounded-lg transition-all duration-200",
            "flex items-center justify-between",
            sizeStyles[size],
            variantStyles[variant],
            disabled &&
              "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800",
            error && "border-red-500 focus-within:ring-red-500",
            "px-3"
          )}
        >
          <span
            className={cn(
              "flex-1 truncate",
              !selectedOption && "text-gray-400 dark:text-gray-500"
            )}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                <span>Carregando...</span>
              </div>
            ) : (
              selectedOption?.label || placeholder
            )}
          </span>

          <div className="flex items-center gap-1">
            {clearable && selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClear(e as any);
                  }
                }}
                className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                aria-label="Limpar seleção"
              >
                <X
                  size={iconSize[size]}
                  className="text-gray-400 pointer-events-none"
                />
              </span>
            )}
            <ChevronDown
              size={iconSize[size]}
              className={cn(
                "transition-transform duration-200 flex-shrink-0",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            role="listbox"
            aria-label="Opções"
          >
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-8 pr-2 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto overscroll-contain">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  Nenhuma opção encontrada
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={selectedOption?.value === option.value}
                    className={cn(
                      "w-full px-3 py-2 text-left transition-colors duration-150",
                      "flex items-center justify-between gap-2",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      option.disabled && "opacity-50 cursor-not-allowed",
                      selectedOption?.value === option.value &&
                        "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {option.icon && (
                        <span className="text-gray-500">{option.icon}</span>
                      )}
                      <span className="text-sm truncate">{option.label}</span>
                    </div>
                    {selectedOption?.value === option.value && (
                      <Check size={14} className="flex-shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p
          className={cn(
            "text-xs",
            error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

// Versão integrada com React Hook Form
export function FormFancySelect<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  name,
  options,
  placeholder,
  searchable,
  clearable,
  disabled,
  loading,
  label,
  required,
  helperText,
  size,
  variant,
}: FormFancySelectProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required ? "Este campo é obrigatório" : undefined },
  });

  return (
    <FancySelect
      options={options}
      placeholder={placeholder}
      searchable={searchable}
      clearable={clearable}
      disabled={disabled}
      loading={loading}
      error={error?.message}
      value={field.value}
      onChange={field.onChange}
      label={label}
      required={required}
      helperText={helperText}
      size={size}
      variant={variant}
    />
  );
}
