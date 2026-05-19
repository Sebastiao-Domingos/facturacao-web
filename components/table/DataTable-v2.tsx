"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { clsx } from "clsx";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

// ═══════════════════════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type SortDirection = "asc" | "desc" | null;

/** Definição de uma coluna */
export interface ColumnDef<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
  width?: number;
  /** Ocultar por defeito (ainda aparece no toggle) */
  hidden?: boolean;
}

/** Acção built-in */
export type BuiltinAction = "view" | "edit" | "delete";

/** Acção personalizada */
export interface CustomAction<T> {
  key: string;
  label: string | ((row: T) => string);
  icon?: React.ReactNode | ((row: T) => React.ReactNode);
  /** Ocultar acção para linhas específicas */
  hidden?: (row: T) => boolean;
  /** Desactivar acção para linhas específicas */
  disabled?: (row: T) => boolean;
  /** Cor do item no menu: default | danger | warning | success */
  variant?:
    | "default"
    | "danger"
    | "warning"
    | "success"
    | ((row: T) => "default" | "danger" | "warning" | "success");
  onClick: (row: T) => void;
}
/** Configuração de paginação do servidor */
export interface ServerPaginationConfig {
  /** Total real de itens (vem do back) */
  total: number;
  /** Página actual controlada externamente */
  page: number;
  /** Tamanho da página controlado externamente */
  pageSize: number;
  /** Callback chamado quando o user muda de página */
  onPageChange: (page: number) => void;
  /** Callback chamado quando o user muda o tamanho */
  onPageSizeChange: (size: number) => void;
}

/** Configuração de pesquisa no servidor */
export interface ServerSearchConfig {
  /** Callback disparado com debounce quando o user pesquisa */
  onSearch: (query: string) => void;
  /** Delay em ms (default 400) */
  debounce?: number;
  /** Placeholder personalizado */
  placeholder?: string;
  /** Mostrar indicador de loading durante pesquisa */
  searching?: boolean;
}

export interface DataTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];

  // ── Identificação ──────────────────────────────
  /** Campo único para identificar cada linha (para checkboxes) */
  rowKey?: keyof T | ((row: T) => string);

  // ── Acções ────────────────────────────────────
  /** Quais acções built-in mostrar */
  actions?: BuiltinAction[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  /** Acções completamente personalizadas */
  customActions?: CustomAction<T>[];

  // ── Selecção ──────────────────────────────────
  /** Mostrar coluna de checkboxes */
  selectable?: boolean;
  /** Linhas seleccionadas (controlado externamente) */
  selectedRows?: T[];
  /** Callback quando a selecção muda */
  onSelectionChange?: (rows: T[]) => void;
  /** Barra de acções em bulk quando há selecção */
  bulkActions?: CustomAction<T[]>[];

  // ── Paginação ─────────────────────────────────
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  /** Se fornecido, activa paginação server-side */
  serverPagination?: ServerPaginationConfig;

  // ── Pesquisa ──────────────────────────────────
  globalSearch?: boolean;
  /** Se fornecido, activa pesquisa server-side */
  serverSearch?: ServerSearchConfig;

  // ── UI ────────────────────────────────────────
  caption?: string;
  onRowClick?: (row: T) => void;
  columnToggle?: boolean;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  /** Mostrar contagem de resultados na toolbar */
  showCount?: boolean;
  /** Densidade das linhas */
  density?: "compact" | "normal" | "relaxed";
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ZOD SCHEMA
// ═══════════════════════════════════════════════════════════════════════════════

const searchSchema = z.object({
  globalQuery: z.string().max(200).optional(),
  serverQuery: z.string().max(200).optional(),
  columnFilters: z.record(z.string(), z.string().max(200)).optional(),
});
type SearchFormValues = z.infer<typeof searchSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function getNestedValue<T extends object>(obj: T, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object")
      return (acc as Record<string, unknown>)[part];
    return undefined;
  }, obj);
}

function matchesFilter(value: unknown, query: string): boolean {
  if (!query) return true;
  return String(value ?? "")
    .toLowerCase()
    .includes(query.toLowerCase());
}

function getRowKey<T extends object>(
  row: T,
  rowKey?: keyof T | ((row: T) => string),
  index?: number,
): string {
  if (!rowKey) return String(index ?? Math.random());
  if (typeof rowKey === "function") return rowKey(row);
  return String((row as Record<string, unknown>)[rowKey as string] ?? index);
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════════════════════════════════════════════

const IC = {
  Search: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4"
    >
      <circle cx="9" cy="9" r="6" />
      <path d="M15 15l3 3" strokeLinecap="round" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  ),
  ChevronUp: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path
        fillRule="evenodd"
        d="M10 7.293l6.354 6.353-1.415 1.415L10 10.12l-4.94 4.94-1.413-1.414L10 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path
        fillRule="evenodd"
        d="M10 12.707L3.646 6.354l1.415-1.415L10 9.879l4.94-4.94 1.413 1.414L10 12.707z"
        clipRule="evenodd"
      />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Columns: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4"
    >
      <rect x="2" y="4" width="6" height="12" rx="1" />
      <rect x="12" y="4" width="6" height="12" rx="1" />
    </svg>
  ),
  Spinner: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5 animate-spin"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity={0.2} />
      <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
    </svg>
  ),
  DotsVertical: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  ),
  Eye: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="w-3.5 h-3.5"
    >
      <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
      <circle cx="10" cy="10" r="2.5" />
    </svg>
  ),
  Edit: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="w-3.5 h-3.5"
    >
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-9.5 9.5a2 2 0 01-.878.514l-3 .75a.5.5 0 01-.607-.607l.75-3a2 2 0 01.514-.878l9.893-9.087z" />
    </svg>
  ),
  Trash: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="w-3.5 h-3.5"
    >
      <path
        d="M6 6l.5 9h7L14 6M4 6h12M8 6V4h4v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Filter: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4"
    >
      <path d="M3 5h14M6 10h8M9 15h2" strokeLinecap="round" />
    </svg>
  ),
  Database: () => (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4"
    >
      <ellipse cx="10" cy="5" rx="7" ry="2.5" />
      <path d="M3 5v10c0 1.38 3.134 2.5 7 2.5S17 16.38 17 15V5" />
      <path d="M3 10c0 1.38 3.134 2.5 7 2.5S17 11.38 17 10" />
    </svg>
  ),
  FirstPage: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M4 5h2v10H4V5zm3.293 9.707l4.95-4.95a1 1 0 000-1.414l-4.95-4.95A1 1 0 005.88 5.807v8.386a1 1 0 001.413.514z" />
    </svg>
  ),
  LastPage: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M16 5h-2v10h2V5zm-3.293 9.707l-4.95-4.95a1 1 0 010-1.414l4.95-4.95a1 1 0 011.413.514v8.386a1 1 0 01-1.413.514z" />
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
//  SORT INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

function SortIndicator({ direction }: { direction: SortDirection }) {
  return (
    <span className="ml-1 flex flex-col gap-px opacity-40">
      <span
        style={{
          color: direction === "asc" ? "var(--table-sort-active)" : undefined,
          opacity: direction === "asc" ? 1 : undefined,
        }}
      >
        <IC.ChevronUp />
      </span>
      <span
        style={{
          color: direction === "desc" ? "var(--table-sort-active)" : undefined,
          opacity: direction === "desc" ? 1 : undefined,
        }}
      >
        <IC.ChevronDown />
      </span>
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CHECKBOX
// ═══════════════════════════════════════════════════════════════════════════════

function Checkbox({
  checked,
  indeterminate,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  return (
    <label
      className="inline-flex items-center cursor-pointer group"
      aria-label={label}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className="flex h-4 w-4 items-center justify-center rounded transition-all duration-150"
        style={{
          border:
            checked || indeterminate
              ? "none"
              : "1.5px solid var(--table-input-border)",
          background:
            checked || indeterminate
              ? "var(--primary)"
              : "var(--table-input-bg)",
        }}
      >
        {indeterminate ? (
          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
            <path
              d="M2.5 6h7"
              stroke="var(--primary-foreground)"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          </svg>
        ) : checked ? (
          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
            <path
              d="M2 6l3 3 5-5"
              stroke="var(--primary-foreground)"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
    </label>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ACTION MENU (dropdown por linha)
// ═══════════════════════════════════════════════════════════════════════════════

const VARIANT_COLORS: Record<string, string> = {
  default: "var(--table-foreground)",
  danger: "oklch(0.6 0.18 25)",
  warning: "oklch(0.7 0.15 80)",
  success: "oklch(0.55 0.15 150)",
};

interface ActionMenuProps<T extends object> {
  row: T;
  actions?: BuiltinAction[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  customActions?: CustomAction<T>[];
}

function ActionMenu<T extends object>({
  row,
  actions = [],
  onView,
  onEdit,
  onDelete,
  customActions = [],
}: ActionMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const hasBuiltins = actions.length > 0;
  const hasCustom = customActions.length > 0;
  if (!hasBuiltins && !hasCustom) return null;

  //   const builtinItems: { key: BuiltinAction; label: string; icon: React.ReactNode; handler?: () => void }[] = [
  //     { key: "view",   label: "Ver detalhes", icon: <IC.Eye />,   handler: onView   ? () => { onView(row);   setOpen(false); } : undefined },
  //     { key: "edit",   label: "Editar",        icon: <IC.Edit />,  handler: onEdit   ? () => { onEdit(row);   setOpen(false); } : undefined },
  //     { key: "delete", label: "Eliminar",      icon: <IC.Trash />, handler: onDelete ? () => { onDelete(row); setOpen(false); } : undefined },
  //   ].filter((i) => actions.includes(i.key));

  const builtinItems = [
    {
      key: "view" as const,
      label: "Ver detalhes",
      icon: <IC.Eye />,
      handler: onView
        ? () => {
            onView(row);
            setOpen(false);
          }
        : undefined,
    },
    {
      key: "edit" as const,
      label: "Editar",
      icon: <IC.Edit />,
      handler: onEdit
        ? () => {
            onEdit(row);
            setOpen(false);
          }
        : undefined,
    },
    {
      key: "delete" as const,
      label: "Eliminar",
      icon: <IC.Trash />,
      handler: onDelete
        ? () => {
            onDelete(row);
            setOpen(false);
          }
        : undefined,
    },
  ].filter((i) => actions.includes(i.key));

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center h-7 w-7 rounded-lg opacity-0 group-hover/row:opacity-100 transition-all duration-150 focus:opacity-100 focus:outline-none"
        style={{
          background: open ? "var(--table-toggle-bg)" : "transparent",
          color: "var(--table-muted)",
        }}
        aria-label="Acções"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <IC.DotsVertical />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 z-50 mt-1 w-44 rounded-xl overflow-hidden shadow-xl"
          style={{
            background: "var(--table-toggle-panel)",
            border: "1px solid var(--table-border)",
            top: "100%",
          }}
          role="menu"
        >
          {/* Built-in actions */}
          {builtinItems.map((item, i) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              onClick={item.handler}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left"
              style={{
                color:
                  item.key === "delete"
                    ? VARIANT_COLORS.danger
                    : "var(--table-foreground)",
                borderBottom:
                  i < builtinItems.length - 1
                    ? "1px solid var(--table-border)"
                    : undefined,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--table-row-stripe)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span
                style={{
                  color:
                    item.key === "delete"
                      ? VARIANT_COLORS.danger
                      : "var(--table-muted)",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}

          {/* Separador */}
          {hasBuiltins && hasCustom && (
            <div
              style={{
                height: "1px",
                background: "var(--table-border)",
                margin: "2px 0",
              }}
            />
          )}

          {/* Custom actions */}
          {customActions
            .filter((a) => !a.hidden?.(row))
            .map((action) => {
              const isDisabled = action.disabled?.(row) ?? false;
              const color =
                VARIANT_COLORS[
                  typeof action.variant == "function"
                    ? action.variant(row)
                    : action.variant || "default"
                ];
              return (
                <button
                  key={action.key}
                  type="button"
                  role="menuitem"
                  disabled={isDisabled}
                  onClick={() => {
                    action.onClick(row);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ color }}
                  onMouseEnter={(e) =>
                    !isDisabled &&
                    (e.currentTarget.style.background =
                      "var(--table-row-stripe)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {action.icon && (
                    <span style={{ color: "var(--table-muted)" }}>
                      {typeof action.icon === "function"
                        ? action.icon(row)
                        : action.icon}
                    </span>
                  )}
                  {typeof action.label === "function"
                    ? action.label(row)
                    : action.label}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  BULK ACTION BAR
// ═══════════════════════════════════════════════════════════════════════════════

interface BulkBarProps<T extends object> {
  count: number;
  bulkActions?: CustomAction<T[]>[];
  selectedRows: T[];
  onClear: () => void;
}

function BulkBar<T extends object>({
  count,
  bulkActions = [],
  selectedRows,
  onClear,
}: BulkBarProps<T>) {
  if (count === 0) return null;
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium animate-in slide-in-from-top-1 duration-200"
      style={{
        background: "var(--primary)",
        color: "var(--primary-foreground)",
        borderBottom: "1px solid var(--table-border)",
      }}
    >
      <Checkbox checked={true} onChange={onClear} label="Desseleccionar tudo" />
      <span className="text-xs font-semibold">
        {count} {count === 1 ? "linha seleccionada" : "linhas seleccionadas"}
      </span>

      <div className="ml-auto flex items-center gap-2">
        {bulkActions.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => action.onClick(selectedRows)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150"
            style={{
              background: "var(--primary-foreground)",
              color: "var(--primary)",
            }}
          >
            {typeof action.icon === "function"
              ? action.icon(selectedRows)
              : action.icon}
            {typeof action.label === "function"
              ? action.label(selectedRows)
              : action.label}
          </button>
        ))}

        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center justify-center h-6 w-6 rounded-md opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: "var(--primary-foreground)" }}
          aria-label="Cancelar selecção"
        >
          <IC.Close />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  COLUMN TOGGLE
// ═══════════════════════════════════════════════════════════════════════════════

function ColumnToggle<T>({
  columns,
  visible,
  onToggle,
}: {
  columns: ColumnDef<T>[];
  visible: Set<string>;
  onToggle: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors focus:outline-none"
        style={{
          background: open
            ? "var(--table-toggle-bg-hover)"
            : "var(--table-toggle-bg)",
          border: "1px solid var(--table-border)",
          color: "var(--table-muted)",
        }}
      >
        <IC.Columns />
        Colunas
      </button>

      {open && (
        <div
          className="absolute right-0 z-30 mt-2 w-52 rounded-xl overflow-hidden shadow-2xl"
          style={{
            background: "var(--table-toggle-panel)",
            border: "1px solid var(--table-border)",
          }}
        >
          <div
            className="flex items-center justify-between px-3 py-2.5"
            style={{ borderBottom: "1px solid var(--table-border)" }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--table-muted)" }}
            >
              Visibilidade
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ color: "var(--table-muted)" }}
            >
              <IC.Close />
            </button>
          </div>
          <ul className="py-1 max-h-64 overflow-y-auto">
            {columns.map((col) => {
              const key = String(col.accessorKey);
              const checked = visible.has(key);
              return (
                <li key={key}>
                  <label
                    className="flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors"
                    style={{ color: "var(--table-foreground)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "var(--table-row-stripe)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "transparent")
                    }
                  >
                    <Checkbox
                      checked={checked}
                      onChange={() => onToggle(key)}
                    />
                    <span className="text-xs">{col.header}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PAGINATION — suporta local e server
// ═══════════════════════════════════════════════════════════════════════════════

interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  pageSizeOptions: number[];
  total: number;
  isServer?: boolean;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

function Pagination({
  page,
  pageCount,
  pageSize,
  pageSizeOptions,
  total,
  isServer,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(String(page));

  useEffect(() => setInputPage(String(page)), [page]);

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages = useMemo(() => {
    const delta = 1;
    const range: (number | "…")[] = [];
    for (let i = 1; i <= pageCount; i++) {
      if (
        i === 1 ||
        i === pageCount ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "…") {
        range.push("…");
      }
    }
    return range;
  }, [page, pageCount]);

  const handleInputSubmit = () => {
    const n = parseInt(inputPage, 10);
    if (!isNaN(n) && n >= 1 && n <= pageCount) onPageChange(n);
    else setInputPage(String(page));
  };

  return (
    <div
      className="flex flex-wrap items-center gap-3 px-4 py-3"
      style={{ borderTop: "1px solid var(--table-border)" }}
    >
      {/* Badge server */}
      {isServer && (
        <span
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            background: "var(--accent)",
            color: "var(--accent-foreground)",
          }}
        >
          <IC.Database />
          Server
        </span>
      )}

      {/* Contagem */}
      <p
        className="text-xs tabular-nums sm:mr-auto"
        style={{ color: "var(--table-muted)" }}
      >
        {total === 0 ? "Sem resultados" : `${start}–${end} de ${total}`}
      </p>

      {/* Navegar para primeira / última */}
      <div className="flex items-center gap-1">
        <PagBtn
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="Primeira página"
        >
          <IC.FirstPage />
        </PagBtn>
        <PagBtn
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Anterior"
        >
          <IC.ChevronLeft />
        </PagBtn>

        {/* Números */}
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`e-${i}`}
              className="w-8 text-center text-xs"
              style={{ color: "var(--table-muted)" }}
            >
              …
            </span>
          ) : (
            <PagNumBtn
              key={p}
              num={p as number}
              isActive={page === p}
              onClick={() => onPageChange(p as number)}
            />
          ),
        )}

        <PagBtn
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Próxima"
        >
          <IC.ChevronRight />
        </PagBtn>
        <PagBtn
          onClick={() => onPageChange(pageCount)}
          disabled={page === pageCount}
          aria-label="Última página"
        >
          <IC.LastPage />
        </PagBtn>
      </div>

      {/* Ir para página (útil em server-side com muitas páginas) */}
      {pageCount > 5 && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: "var(--table-muted)" }}>
            Ir para
          </span>
          <input
            type="number"
            min={1}
            max={pageCount}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onBlur={handleInputSubmit}
            onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
            className="h-7 w-14 rounded-lg px-2 text-center text-xs focus:outline-none focus:ring-1 transition-colors"
            style={{
              background: "var(--table-input-bg)",
              border: "1px solid var(--table-input-border)",
              color: "var(--table-foreground)",
            }}
          />
        </div>
      )}

      {/* Linhas por página */}
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        aria-label="Linhas por página"
        className="h-7 rounded-lg px-2 text-xs focus:outline-none transition-colors"
        style={{
          background: "var(--table-input-bg)",
          border: "1px solid var(--table-input-border)",
          color: "var(--table-muted)",
        }}
      >
        {pageSizeOptions.map((s) => (
          <option key={s} value={s}>
            {s} / pág.
          </option>
        ))}
      </select>
    </div>
  );
}

// Botões de paginação auxiliares

function PagBtn({
  children,
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-sm transition-all duration-150 focus:outline-none disabled:pointer-events-none disabled:opacity-30"
      style={{
        background: hov
          ? "var(--table-pagination-btn-hover)"
          : "var(--table-pagination-btn)",
        color: "var(--table-muted)",
      }}
    >
      {children}
    </button>
  );
}

function PagNumBtn({
  num,
  isActive,
  onClick,
}: {
  num: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-xs font-medium transition-all duration-150 focus:outline-none"
      style={{
        background: isActive
          ? "var(--table-pagination-active-bg)"
          : hov
            ? "var(--table-pagination-btn-hover)"
            : "var(--table-pagination-btn)",
        color: isActive
          ? "var(--table-pagination-active-fg)"
          : "var(--table-muted)",
      }}
    >
      {num}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  TABLE ROW
// ═══════════════════════════════════════════════════════════════════════════════

const DENSITY_PADDING: Record<string, string> = {
  compact: "px-3 py-1.5",
  normal: "px-4 py-3",
  relaxed: "px-4 py-4",
};

interface TableRowProps<T extends object> {
  row: T;
  rowIdx: number;
  rowKey: string;
  visibleColumns: ColumnDef<T>[];
  density: "compact" | "normal" | "relaxed";
  selectable?: boolean;
  isSelected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onRowClick?: (row: T) => void;
  hasActions: boolean;
  actions?: BuiltinAction[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  customActions?: CustomAction<T>[];
}

function TableRow<T extends object>({
  row,
  rowIdx,
  rowKey,
  visibleColumns,
  density,
  selectable,
  isSelected,
  onSelectChange,
  onRowClick,
  hasActions,
  actions,
  onView,
  onEdit,
  onDelete,
  customActions,
}: TableRowProps<T>) {
  const [hovered, setHovered] = useState(false);
  const pad = DENSITY_PADDING[density];

  const bg = isSelected
    ? "var(--table-row-selected)"
    : hovered
      ? "var(--table-row-hover)"
      : rowIdx % 2 !== 0
        ? "var(--table-row-stripe)"
        : "transparent";

  return (
    <tr
      className="group/row transition-colors duration-100"
      style={{ background: bg, borderBottom: "1px solid var(--table-border)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onRowClick?.(row)}
      data-selected={isSelected}
    >
      {/* Checkbox */}
      {selectable && (
        <td
          className={clsx("text-center", pad)}
          style={{ width: 44 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={!!isSelected}
            onChange={(v) => onSelectChange?.(v)}
            label={`Seleccionar linha ${rowKey}`}
          />
        </td>
      )}

      {/* Células */}
      {visibleColumns.map((col) => {
        const key = String(col.accessorKey);
        const value = getNestedValue(row, key);
        return (
          <td
            key={key}
            className={clsx(
              "text-sm align-middle",
              pad,
              onRowClick && "cursor-pointer",
              col.className,
            )}
            style={{ color: "var(--table-foreground)" }}
          >
            {col.cell ? col.cell(value, row) : String(value ?? "—")}
          </td>
        );
      })}

      {/* Actions */}
      {hasActions && (
        <td
          className={clsx("text-right align-middle", pad)}
          style={{ width: 52 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ActionMenu
            row={row}
            actions={actions}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            customActions={customActions}
          />
        </td>
      )}
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT — DataTableV2
// ═══════════════════════════════════════════════════════════════════════════════

export function DataTableV2<T extends object>({
  data,
  columns,
  rowKey,
  // Actions
  actions = [],
  onView,
  onEdit,
  onDelete,
  customActions = [],
  // Selecção
  selectable = false,
  selectedRows: externalSelected,
  onSelectionChange,
  bulkActions = [],
  // Paginação
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  serverPagination,
  // Pesquisa
  globalSearch = true,
  serverSearch,
  // UI
  caption,
  onRowClick,
  columnToggle = true,
  className,
  loading = false,
  emptyMessage = "Nenhum dado encontrado.",
  showCount = true,
  density = "normal",
}: DataTableProps<T>) {
  const isServerPagination = !!serverPagination;
  const isServerSearch = !!serverSearch;
  const hasActions = actions.length > 0 || customActions.length > 0;

  // ── Sort ──────────────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  // ── Paginação local ───────────────────────────────────────────────────────
  const [localPage, setLocalPage] = useState(1);
  const [localPageSize, setLocalPageSize] = useState(defaultPageSize);

  const page = isServerPagination ? serverPagination.page : localPage;
  const pageSize = isServerPagination
    ? serverPagination.pageSize
    : localPageSize;

  const handlePageChange = useCallback(
    (p: number) => {
      if (isServerPagination) serverPagination.onPageChange(p);
      else setLocalPage(p);
    },
    [isServerPagination, serverPagination],
  );

  const handlePageSizeChange = useCallback(
    (s: number) => {
      if (isServerPagination) serverPagination.onPageSizeChange(s);
      else {
        setLocalPageSize(s);
        setLocalPage(1);
      }
    },
    [isServerPagination, serverPagination],
  );

  // ── Colunas visíveis ─────────────────────────────────────────────────────
  const [visibleCols, setVisibleCols] = useState<Set<string>>(
    () =>
      new Set(
        columns.filter((c) => !c.hidden).map((c) => String(c.accessorKey)),
      ),
  );

  const visibleColumns = useMemo(
    () => columns.filter((c) => visibleCols.has(String(c.accessorKey))),
    [columns, visibleCols],
  );

  const toggleColumn = useCallback((key: string) => {
    setVisibleCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size === 1) return prev;
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // ── Sort ──────────────────────────────────────────────────────────────────
  const handleSort = useCallback(
    (key: string) => {
      if (sortKey !== key) {
        setSortKey(key);
        setSortDir("asc");
      } else {
        setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
        if (sortDir === "desc") setSortKey(null);
      }
      if (!isServerPagination) setLocalPage(1);
    },
    [sortKey, sortDir, isServerPagination],
  );

  // ── Form de pesquisa ─────────────────────────────────────────────────────
  const { control, watch, setValue } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { globalQuery: "", serverQuery: "", columnFilters: {} },
  });

  const globalQuery = watch("globalQuery") ?? "";
  const serverQuery = watch("serverQuery") ?? "";
  const columnFilters = (watch("columnFilters") ?? {}) as Record<
    string,
    string
  >;

  // Debounce da pesquisa server-side
  const debouncedServerQuery = useDebounce(
    serverQuery,
    serverSearch?.debounce ?? 400,
  );

  useEffect(() => {
    if (isServerSearch) serverSearch.onSearch(debouncedServerQuery);
  }, [debouncedServerQuery]); // eslint-disable-line

  // ── Selecção ─────────────────────────────────────────────────────────────
  const [internalSelected, setInternalSelected] = useState<Set<string>>(
    new Set(),
  );

  const selectedKeys = useMemo(() => {
    if (externalSelected) {
      return new Set(externalSelected.map((r, i) => getRowKey(r, rowKey, i)));
    }
    return internalSelected;
  }, [externalSelected, internalSelected, rowKey]);

  const handleSelectRow = useCallback(
    (row: T, index: number, selected: boolean) => {
      const key = getRowKey(row, rowKey, index);
      setInternalSelected((prev) => {
        const next = new Set(prev);
        if (selected) next.add(key);
        else next.delete(key);
        return next;
      });
      if (onSelectionChange) {
        const updated = selected
          ? [...(externalSelected ?? []), row]
          : (externalSelected ?? []).filter(
              (_, i) => getRowKey(_, rowKey, i) !== key,
            );
        onSelectionChange(updated);
      }
    },
    [rowKey, externalSelected, onSelectionChange],
  );

  const selectedRowObjects = useMemo(
    () => data.filter((r, i) => selectedKeys.has(getRowKey(r, rowKey, i))),
    [data, selectedKeys, rowKey],
  );

  const allPageKeys = useMemo(
    () => data.map((r, i) => getRowKey(r, rowKey, i)),
    [data, rowKey],
  );

  const allSelected =
    allPageKeys.length > 0 && allPageKeys.every((k) => selectedKeys.has(k));
  const someSelected =
    !allSelected && allPageKeys.some((k) => selectedKeys.has(k));

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setInternalSelected(new Set(allPageKeys));
        onSelectionChange?.(data);
      } else {
        setInternalSelected(new Set());
        onSelectionChange?.([]);
      }
    },
    [allPageKeys, data, onSelectionChange],
  );

  const clearSelection = useCallback(() => {
    setInternalSelected(new Set());
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  // ── Pipeline local: filter → sort → paginate ──────────────────────────────
  const processed = useMemo(() => {
    if (isServerPagination) return data; // o back já tratou

    let rows = [...data];

    // Filtro global local
    if (globalQuery) {
      rows = rows.filter((row) =>
        columns.some((col) =>
          matchesFilter(
            getNestedValue(row, String(col.accessorKey)),
            globalQuery,
          ),
        ),
      );
    }

    // Filtros por coluna
    Object.entries(columnFilters).forEach(([key, query]) => {
      if (!query || typeof query !== "string") return;
      rows = rows.filter((row) =>
        matchesFilter(getNestedValue(row, key), query),
      );
    });

    // Ordenação
    if (sortKey && sortDir) {
      rows.sort((a, b) => {
        const av = String(getNestedValue(a, sortKey) ?? "");
        const bv = String(getNestedValue(b, sortKey) ?? "");
        const cmp =
          isNaN(Number(av)) || isNaN(Number(bv))
            ? av.localeCompare(bv)
            : Number(av) - Number(bv);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return rows;
  }, [
    data,
    columns,
    globalQuery,
    columnFilters,
    sortKey,
    sortDir,
    isServerPagination,
  ]);

  const total = isServerPagination ? serverPagination.total : processed.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const paged = useMemo(() => {
    if (isServerPagination) return data; // o back já paginado
    return processed.slice(
      (localPage - 1) * localPageSize,
      localPage * localPageSize,
    );
  }, [processed, localPage, localPageSize, isServerPagination, data]);

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div
      className={clsx(
        "relative flex flex-col overflow-hidden shadow-sm",
        className,
      )}
      style={{
        background: "var(--table-bg)",
        color: "var(--table-foreground)",
        border: "1px solid var(--table-border)",
        borderRadius: "var(--radius-xl)",
      }}
    >
      {/* ── Toolbar ── */}
      <div
        className="flex flex-wrap items-center gap-2 px-4 py-3"
        style={{
          background: "var(--table-toolbar-bg)",
          borderBottom: "1px solid var(--table-border)",
        }}
      >
        {/* Caption + contagem */}
        <div className="flex items-baseline gap-2 mr-auto min-w-0">
          {caption && (
            <h2
              className="text-sm font-semibold tracking-tight truncate"
              style={{ color: "var(--table-foreground)" }}
            >
              {caption}
            </h2>
          )}
          {showCount && !loading && (
            <span
              className="text-xs tabular-nums rounded-full px-2 py-0.5 font-medium"
              style={{
                background: "var(--table-toggle-bg)",
                color: "var(--table-muted)",
              }}
            >
              {total}
            </span>
          )}
        </div>

        {/* Pesquisa local */}
        {globalSearch && !isServerSearch && (
          <Controller
            control={control}
            name="globalQuery"
            render={({ field }) => (
              <div className="relative">
                <span
                  className="pointer-events-none absolute inset-y-0 left-3 flex items-center"
                  style={{ color: "var(--table-muted)" }}
                >
                  <IC.Search />
                </span>
                <input
                  {...field}
                  placeholder="Pesquisar…"
                  onChange={(e) => {
                    field.onChange(e);
                    setLocalPage(1);
                  }}
                  className="w-56 rounded-lg py-2 pl-9 pr-8 text-sm transition-colors focus:outline-none focus:ring-2"
                  style={{
                    background: "var(--table-input-bg)",
                    border: "1px solid var(--table-input-border)",
                    color: "var(--table-foreground)",
                  }}
                />
                {field.value && (
                  <button
                    type="button"
                    onClick={() => {
                      setValue("globalQuery", "");
                      setLocalPage(1);
                    }}
                    className="absolute inset-y-0 right-2.5 flex items-center"
                    style={{ color: "var(--table-muted)" }}
                  >
                    <IC.Close />
                  </button>
                )}
              </div>
            )}
          />
        )}

        {/* Pesquisa server-side */}
        {isServerSearch && (
          <Controller
            control={control}
            name="serverQuery"
            render={({ field }) => (
              <div className="relative">
                <span
                  className="pointer-events-none absolute inset-y-0 left-3 flex items-center"
                  style={{ color: "var(--table-muted)" }}
                >
                  {serverSearch.searching ? <IC.Spinner /> : <IC.Database />}
                </span>
                <input
                  {...field}
                  placeholder={
                    serverSearch.placeholder ?? "Pesquisar no servidor…"
                  }
                  className="w-64 rounded-lg py-2 pl-9 pr-8 text-sm transition-colors focus:outline-none focus:ring-2"
                  style={{
                    background: "var(--table-input-bg)",
                    border: "1px solid var(--table-input-border)",
                    color: "var(--table-foreground)",
                  }}
                />
                {field.value && (
                  <button
                    type="button"
                    onClick={() => setValue("serverQuery", "")}
                    className="absolute inset-y-0 right-2.5 flex items-center"
                    style={{ color: "var(--table-muted)" }}
                  >
                    <IC.Close />
                  </button>
                )}
                {/* Badge indicador */}
                <span
                  className="absolute -top-1.5 -right-1.5 text-[9px] font-bold rounded-full px-1"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  API
                </span>
              </div>
            )}
          />
        )}

        {/* Toggle colunas */}
        {columnToggle && (
          <ColumnToggle
            columns={columns}
            visible={visibleCols}
            onToggle={toggleColumn}
          />
        )}
      </div>

      {/* ── Bulk bar ── */}
      {selectable && (
        <BulkBar
          count={selectedKeys.size}
          bulkActions={bulkActions}
          selectedRows={selectedRowObjects}
          onClear={clearSelection}
        />
      )}

      {/* ── Table ── */}
      {/* <div className="overflow-x-auto"> */}
      <ScrollArea className="max-w-full overflow-x-auto">
        <ScrollBar orientation="horizontal" />
        <table className="w-full min-w-max border-collapse text-sm">
          {/* Cabeçalho */}
          <thead>
            <tr style={{ borderBottom: "1px solid var(--table-border)" }}>
              {/* Checkbox header */}
              {selectable && (
                <th
                  className="text-center px-3 py-3 select-none"
                  style={{ background: "var(--table-header-bg)", width: 44 }}
                >
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={handleSelectAll}
                    label="Seleccionar tudo"
                  />
                </th>
              )}

              {/* Colunas */}
              {visibleColumns.map((col) => {
                const key = String(col.accessorKey);
                const dir: SortDirection = sortKey === key ? sortDir : null;
                return (
                  <th
                    key={key}
                    style={{
                      width: col.width,
                      background: "var(--table-header-bg)",
                      color: "var(--table-header-foreground)",
                    }}
                    className={clsx(
                      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider select-none transition-colors",
                      col.sortable && "cursor-pointer hover:brightness-95",
                      col.className,
                    )}
                    onClick={() => col.sortable && handleSort(key)}
                    aria-sort={
                      dir === "asc"
                        ? "ascending"
                        : dir === "desc"
                          ? "descending"
                          : "none"
                    }
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {col.header}
                      {col.sortable && <SortIndicator direction={dir} />}
                    </span>
                  </th>
                );
              })}

              {/* Actions header */}
              {hasActions && (
                <th
                  className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider select-none"
                  style={{
                    background: "var(--table-header-bg)",
                    color: "var(--table-header-foreground)",
                    width: 52,
                  }}
                >
                  Acções
                </th>
              )}
            </tr>

            {/* Filtros por coluna */}
            {visibleColumns.some((c) => c.filterable) && (
              <tr style={{ borderBottom: "1px solid var(--table-border)" }}>
                {selectable && (
                  <td
                    style={{
                      background: "var(--table-header-bg)",
                      width: 44,
                    }}
                  />
                )}
                {visibleColumns.map((col) => {
                  const key = String(col.accessorKey);
                  return (
                    <td
                      key={key}
                      className="px-3 py-1.5"
                      style={{ background: "var(--table-header-bg)" }}
                    >
                      {col.filterable && (
                        <Controller
                          control={control}
                          name={`columnFilters.${key}`}
                          render={({ field }) => (
                            <div className="relative">
                              <span
                                className="pointer-events-none absolute inset-y-0 left-2 flex items-center"
                                style={{ color: "var(--table-muted)" }}
                              >
                                <IC.Filter />
                              </span>
                              <input
                                {...field}
                                value={field.value ?? ""}
                                placeholder={col.header}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setLocalPage(1);
                                }}
                                className="w-full rounded-md pl-7 pr-2 py-1 text-xs transition-colors focus:outline-none focus:ring-1"
                                style={{
                                  background: "var(--table-input-bg)",
                                  border: "1px solid var(--table-input-border)",
                                  color: "var(--table-foreground)",
                                }}
                              />
                            </div>
                          )}
                        />
                      )}
                    </td>
                  );
                })}
                {hasActions && (
                  <td
                    style={{
                      background: "var(--table-header-bg)",
                      width: 52,
                    }}
                  />
                )}
              </tr>
            )}
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={
                    visibleColumns.length +
                    (selectable ? 1 : 0) +
                    (hasActions ? 1 : 0)
                  }
                  className="py-20 text-center"
                >
                  <div
                    className="flex flex-col items-center gap-3"
                    style={{ color: "var(--table-muted)" }}
                  >
                    <IC.Spinner />
                    <span className="text-xs">A carregar…</span>
                  </div>
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    visibleColumns.length +
                    (selectable ? 1 : 0) +
                    (hasActions ? 1 : 0)
                  }
                  className="py-20 text-center text-xs"
                  style={{ color: "var(--table-muted)" }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row, idx) => {
                const key = getRowKey(row, rowKey, idx);
                return (
                  <TableRow
                    key={key}
                    row={row}
                    rowIdx={idx}
                    rowKey={key}
                    visibleColumns={visibleColumns}
                    density={density}
                    selectable={selectable}
                    isSelected={selectedKeys.has(key)}
                    onSelectChange={(selected) =>
                      handleSelectRow(row, idx, selected)
                    }
                    onRowClick={onRowClick}
                    hasActions={hasActions}
                    actions={actions}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    customActions={customActions}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </ScrollArea>
      {/* </div> */}

      {/* ── Paginação ── */}
      <Pagination
        page={page}
        pageCount={pageCount}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        total={total}
        isServer={isServerPagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

export default DataTableV2;
