"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { clsx } from "clsx";
import { IC } from "../../icons/table";
import type {
  BuiltinAction,
  CustomAction,
  ColumnDef,
  Density,
} from "../../types/table";

// ═══════════════════════════════════════════════════════════════════════════════
//  TOKENS DE COR POR VARIANTE DE ACÇÃO
// ═══════════════════════════════════════════════════════════════════════════════

const VARIANT_COLOR: Record<string, string> = {
  default: "var(--dt-fg)",
  danger: "var(--dt-danger)",
  warning: "var(--dt-warning)",
  success: "var(--dt-success)",
};

// ═══════════════════════════════════════════════════════════════════════════════
//  CHECKBOX
// ═══════════════════════════════════════════════════════════════════════════════

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export function Checkbox({
  checked,
  indeterminate,
  onChange,
  label,
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  const active = checked || indeterminate;

  return (
    <label
      htmlFor={id}
      className="inline-flex items-center cursor-pointer"
      aria-label={label}
    >
      <input
        id={id}
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className="flex h-[15px] w-[15px] items-center justify-center rounded-[4px] transition-all duration-150 ring-offset-1"
        style={{
          background: active ? "var(--dt-accent)" : "var(--dt-input-bg)",
          border: active ? "none" : "1.5px solid var(--dt-border-strong)",
          boxShadow: active ? "0 0 0 0px transparent" : undefined,
        }}
      >
        {indeterminate ? (
          <svg viewBox="0 0 10 10" fill="none" className="w-2 h-2">
            <path
              d="M2 5h6"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
        ) : checked ? (
          <svg viewBox="0 0 10 10" fill="none" className="w-2 h-2">
            <path
              d="M1.5 5l2.5 2.5 4.5-4.5"
              stroke="white"
              strokeWidth={2}
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
//  SORT INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

export function SortIndicator({
  direction,
}: {
  direction: "asc" | "desc" | null;
}) {
  return (
    <span className="ml-1.5 inline-flex flex-col gap-[2px]">
      <span
        style={{
          opacity: direction === "asc" ? 1 : 0.25,
          color: direction === "asc" ? "var(--dt-accent)" : "currentColor",
        }}
      >
        <IC.ChevronUp />
      </span>
      <span
        style={{
          opacity: direction === "desc" ? 1 : 0.25,
          color: direction === "desc" ? "var(--dt-accent)" : "currentColor",
        }}
      >
        <IC.ChevronDown />
      </span>
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ACTION MENU
// ═══════════════════════════════════════════════════════════════════════════════

interface ActionMenuProps<T extends object> {
  row: T;
  actions?: BuiltinAction[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  customActions?: CustomAction<T>[];
}

export function ActionMenu<T extends object>({
  row,
  actions = [],
  onView,
  onEdit,
  onDelete,
  customActions = [],
}: ActionMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [open]);

  const hasBuiltins = actions.length > 0;
  const hasCustom = customActions.length > 0;
  if (!hasBuiltins && !hasCustom) return null;

  const builtinDefs = [
    {
      key: "view" as BuiltinAction,
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
      key: "edit" as BuiltinAction,
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
      key: "delete" as BuiltinAction,
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

  const visibleCustom = customActions.filter((a) => !a.hidden?.(row));

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      {/* Trigger */}
      <button
        type="button"
        id={`action-btn-${menuId}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`action-menu-${menuId}`}
        className="inline-flex items-center justify-center h-7 w-7 rounded-lg opacity-0 group-hover/row:opacity-100 focus:opacity-100 transition-all duration-150 focus:outline-none focus-visible:ring-2"
        style={{
          background: open ? "var(--dt-surface-2)" : "transparent",
          color: "var(--dt-muted)",
          ["--tw-ring-color" as string]: "var(--dt-accent)",
        }}
        aria-label="Acções da linha"
      >
        <IC.DotsVertical />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          id={`action-menu-${menuId}`}
          role="menu"
          aria-labelledby={`action-btn-${menuId}`}
          className="absolute right-0 z-50 mt-1 w-44 overflow-hidden"
          style={{
            background: "var(--dt-surface-1)",
            border: "1px solid var(--dt-border)",
            borderRadius: "10px",
            boxShadow: "0 8px 24px var(--dt-shadow)",
            top: "100%",
          }}
        >
          {builtinDefs.map((item, i) => (
            <MenuItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              onClick={item.handler ?? (() => {})}
              color={
                item.key === "delete" ? "var(--dt-danger)" : "var(--dt-fg)"
              }
              iconColor={
                item.key === "delete" ? "var(--dt-danger)" : "var(--dt-muted)"
              }
              hasBorder={i < builtinDefs.length - 1}
            />
          ))}

          {hasBuiltins && visibleCustom.length > 0 && (
            <div
              style={{
                height: 1,
                background: "var(--dt-border)",
                margin: "2px 0",
              }}
            />
          )}

          {visibleCustom.map((action) => {
            const isDisabled = action.disabled?.(row) ?? false;
            const color = VARIANT_COLOR[action.variant ?? "default"];
            return (
              <MenuItem
                key={action.key}
                icon={action.icon}
                label={action.label}
                onClick={() => {
                  action.onClick(row);
                  setOpen(false);
                }}
                color={color}
                iconColor="var(--dt-muted)"
                disabled={isDisabled}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  color,
  iconColor,
  disabled,
  hasBorder,
}: {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
  iconColor: string;
  disabled?: boolean;
  hasBorder?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
      style={{
        color,
        borderBottom: hasBorder ? "1px solid var(--dt-border)" : undefined,
      }}
      onMouseEnter={(e) =>
        !disabled &&
        ((e.currentTarget as HTMLElement).style.background =
          "var(--dt-surface-2)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "transparent")
      }
    >
      {icon && <span style={{ color: iconColor }}>{icon}</span>}
      {label}
    </button>
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

export function BulkBar<T extends object>({
  count,
  bulkActions = [],
  selectedRows,
  onClear,
}: BulkBarProps<T>) {
  if (count === 0) return null;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium"
      style={{
        background: "var(--dt-accent)",
        color: "var(--dt-accent-fg)",
        borderBottom: "1px solid var(--dt-border)",
      }}
    >
      <Checkbox checked onChange={onClear} label="Desseleccionar tudo" />
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
              background: "var(--dt-accent-fg)",
              color: "var(--dt-accent)",
            }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center justify-center h-6 w-6 rounded-md opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: "var(--dt-accent-fg)" }}
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

interface ColumnToggleProps<T> {
  columns: ColumnDef<T>[];
  visible: Set<string>;
  onToggle: (key: string) => void;
}

export function ColumnToggle<T>({
  columns,
  visible,
  onToggle,
}: ColumnToggleProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2"
        style={{
          background: open ? "var(--dt-surface-2)" : "var(--dt-surface-1)",
          border: "1px solid var(--dt-border)",
          color: "var(--dt-muted)",
          ["--tw-ring-color" as string]: "var(--dt-accent)",
        }}
        aria-label="Gerir colunas"
        aria-expanded={open}
      >
        <IC.Columns />
        Colunas
      </button>

      {open && (
        <div
          className="absolute right-0 z-30 mt-2 w-52 overflow-hidden"
          style={{
            background: "var(--dt-surface-1)",
            border: "1px solid var(--dt-border)",
            borderRadius: "10px",
            boxShadow: "0 8px 24px var(--dt-shadow)",
          }}
        >
          <div
            className="flex items-center justify-between px-3 py-2.5"
            style={{ borderBottom: "1px solid var(--dt-border)" }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--dt-muted)" }}
            >
              Visibilidade
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{ color: "var(--dt-muted)" }}
              aria-label="Fechar"
            >
              <IC.Close />
            </button>
          </div>
          <ul className="py-1 max-h-64 overflow-y-auto" role="list">
            {columns.map((col) => {
              const key = String(col.accessorKey);
              const checked = visible.has(key);
              return (
                <li key={key}>
                  <label
                    className="flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors text-xs"
                    style={{ color: "var(--dt-fg)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "var(--dt-surface-2)")
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
                    {col.header}
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
//  PAGINATION
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

export function Pagination({
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

  // Gera sequência de páginas com reticências
  const pages = React.useMemo<(number | "…")[]>(() => {
    const delta = 1;
    const result: (number | "…")[] = [];
    for (let i = 1; i <= pageCount; i++) {
      if (
        i === 1 ||
        i === pageCount ||
        (i >= page - delta && i <= page + delta)
      ) {
        result.push(i);
      } else if (result[result.length - 1] !== "…") {
        result.push("…");
      }
    }
    return result;
  }, [page, pageCount]);

  const commitInput = () => {
    const n = parseInt(inputPage, 10);
    if (!isNaN(n) && n >= 1 && n <= pageCount) onPageChange(n);
    else setInputPage(String(page));
  };

  return (
    <div
      className="flex flex-wrap items-center gap-3 px-4 py-3"
      style={{ borderTop: "1px solid var(--dt-border)" }}
    >
      {isServer && (
        <span
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
          style={{
            background: "var(--dt-surface-2)",
            color: "var(--dt-muted)",
            border: "1px solid var(--dt-border)",
          }}
        >
          <IC.Database />
          Server
        </span>
      )}

      <p
        className="text-xs tabular-nums sm:mr-auto"
        style={{ color: "var(--dt-muted)" }}
      >
        {total === 0
          ? "Sem resultados"
          : `${start}–${end} de ${total.toLocaleString("pt-PT")}`}
      </p>

      {/* Botões de navegação */}
      <div className="flex items-center gap-0.5">
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
          aria-label="Página anterior"
        >
          <IC.ChevronLeft />
        </PagBtn>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`e-${i}`}
              className="w-7 text-center text-xs select-none"
              style={{ color: "var(--dt-muted)" }}
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
          )
        )}

        <PagBtn
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Página seguinte"
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

      {/* Input directo de página */}
      {pageCount > 5 && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: "var(--dt-muted)" }}>
            Ir para
          </span>
          <input
            type="number"
            min={1}
            max={pageCount}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onBlur={commitInput}
            onKeyDown={(e) => e.key === "Enter" && commitInput()}
            aria-label={`Ir para página (1–${pageCount})`}
            className="h-7 w-14 rounded-lg px-2 text-center text-xs focus:outline-none focus-visible:ring-2 transition-colors"
            style={{
              background: "var(--dt-input-bg)",
              border: "1px solid var(--dt-border)",
              color: "var(--dt-fg)",
              ["--tw-ring-color" as string]: "var(--dt-accent)",
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
          background: "var(--dt-input-bg)",
          border: "1px solid var(--dt-border)",
          color: "var(--dt-muted)",
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
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-sm transition-all duration-150 focus:outline-none disabled:pointer-events-none disabled:opacity-30"
      style={{ color: "var(--dt-muted)" }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.background =
          "var(--dt-surface-2)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "transparent")
      }
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
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-xs font-medium transition-all duration-150 focus:outline-none"
      style={{
        background: isActive ? "var(--dt-accent)" : "transparent",
        color: isActive ? "var(--dt-accent-fg)" : "var(--dt-muted)",
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLElement).style.background =
            "var(--dt-surface-2)";
      }}
      onMouseLeave={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {num}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  TABLE ROW
// ═══════════════════════════════════════════════════════════════════════════════

const DENSITY_PADDING: Record<Density, string> = {
  compact: "px-3 py-1.5",
  normal: "px-4 py-3",
  relaxed: "px-4 py-4",
};

interface TableRowProps<T extends object> {
  row: T;
  rowIdx: number;
  rowKey: string;
  visibleColumns: ColumnDef<T>[];
  density: Density;
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

export function TableRow<T extends object>({
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
    ? "var(--dt-row-selected)"
    : hovered
    ? "var(--dt-row-hover)"
    : rowIdx % 2 !== 0
    ? "var(--dt-row-stripe)"
    : "transparent";

  return (
    <tr
      className="group/row transition-colors duration-100"
      style={{
        background: bg,
        borderBottom: "1px solid var(--dt-border)",
        cursor: onRowClick ? "pointer" : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onRowClick?.(row)}
      data-selected={isSelected || undefined}
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

      {/* Data cells */}
      {visibleColumns.map((col) => {
        const key = String(col.accessorKey);
        const value = col.cell
          ? col.cell((row as Record<string, unknown>)[key], row)
          : (() => {
              const raw = key.split(".").reduce<unknown>((acc, part) => {
                if (acc !== null && typeof acc === "object")
                  return (acc as Record<string, unknown>)[part];
                return undefined;
              }, row);
              return raw !== undefined && raw !== null ? String(raw) : "—";
            })();

        return (
          <td
            key={key}
            className={clsx("text-sm align-middle", pad, col.className)}
            style={{ color: "var(--dt-fg)" }}
          >
            {value}
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
