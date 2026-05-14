"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { clsx } from "clsx";

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────

export type SortDirection = "asc" | "desc" | null;

export interface ColumnDef<T> {
  /** Unique key matching a key of T, or a custom id */
  accessorKey: keyof T | string;
  /** Header label */
  header: string;
  /** Custom cell renderer */
  cell?: (value: unknown, row: T) => React.ReactNode;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Whether the column is filterable */
  filterable?: boolean;
  /** Tailwind classes for the <td> */
  className?: string;
  /** Fixed pixel width */
  width?: number;
}

export interface DataTableProps<T extends object> {
  /** Array of rows */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Rows per page options */
  pageSizeOptions?: number[];
  /** Default rows per page */
  defaultPageSize?: number;
  /** Optional caption / title shown above the table */
  caption?: string;
  /** Callback when a row is clicked */
  onRowClick?: (row: T) => void;
  /** Show a global search input */
  globalSearch?: boolean;
  /** Show column visibility toggles */
  columnToggle?: boolean;
  /** Additional wrapper className */
  className?: string;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
}

// ─────────────────────────────────────────────
//  ZOD SCHEMA
//  FIX: z.record(z.string(), z.string().max(200))
//  com dois argumentos explícitos evita que o RHF
//  infira o valor como {} em vez de string.
// ─────────────────────────────────────────────
const searchSchema = z.object({
  globalQuery: z.string().max(200).optional(),
  columnFilters: z.record(z.string(), z.string().max(200)).optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
//  ICONS (inline SVG — zero extra deps)
// ─────────────────────────────────────────────
const IconSearch = () => (
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
);

const IconChevronUp = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path
      fillRule="evenodd"
      d="M10 7.293l6.354 6.353-1.415 1.415L10 10.12l-4.94 4.94-1.413-1.414L10 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

const IconChevronDown = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path
      fillRule="evenodd"
      d="M10 12.707L3.646 6.354l1.415-1.415L10 9.879l4.94-4.94 1.413 1.414L10 12.707z"
      clipRule="evenodd"
    />
  </svg>
);

const IconColumns = () => (
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
);

const IconClose = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

const IconSpinner = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-6 h-6 animate-spin"
  >
    <circle cx="12" cy="12" r="10" strokeOpacity={0.2} />
    <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
  </svg>
);

// ─────────────────────────────────────────────
//  SORT INDICATOR
// ─────────────────────────────────────────────
function SortIndicator({ direction }: { direction: SortDirection }) {
  return (
    <span className="ml-1.5 flex flex-col gap-px opacity-60">
      <span
        className={clsx(
          direction === "asc" ? "opacity-100 text-indigo-400" : ""
        )}
      >
        <IconChevronUp />
      </span>
      <span
        className={clsx(
          direction === "desc" ? "opacity-100 text-indigo-400" : ""
        )}
      >
        <IconChevronDown />
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────
//  PAGINATION
// ─────────────────────────────────────────────
interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  pageSizeOptions: number[];
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

function Pagination({
  page,
  pageCount,
  pageSize,
  pageSizeOptions,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
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

  const btnBase =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1117] disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-3 border-t border-white/[0.06]">
      {/* Contagem */}
      <p className="text-xs text-white/40 tabular-nums sm:mr-auto">
        {total === 0 ? "Sem resultados" : `${start}–${end} de ${total}`}
      </p>

      {/* Botões de página */}
      <div className="flex items-center gap-1">
        <button
          className={clsx(btnBase, "h-8 w-8 bg-white/5 hover:bg-white/10")}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Página anterior"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 text-center text-xs text-white/30"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              aria-current={page === p ? "page" : undefined}
              className={clsx(
                btnBase,
                "h-8 w-8 text-xs",
                page === p
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          className={clsx(btnBase, "h-8 w-8 bg-white/5 hover:bg-white/10")}
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Próxima página"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Selector de linhas por página */}
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="h-8 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Linhas por página"
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

// ─────────────────────────────────────────────
//  COLUMN TOGGLE MENU
// ─────────────────────────────────────────────
interface ColumnToggleProps<T> {
  columns: ColumnDef<T>[];
  visible: Set<string>;
  onToggle: (key: string) => void;
}

function ColumnToggle<T>({ columns, visible, onToggle }: ColumnToggleProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <IconColumns />
        Colunas
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-48 rounded-xl border border-white/10 bg-[#1a1d27] shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Visibilidade
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-white/30 hover:text-white/60 transition"
            >
              <IconClose />
            </button>
          </div>
          <ul className="py-1">
            {columns.map((col) => {
              const key = String(col.accessorKey);
              const checked = visible.has(key);
              return (
                <li key={key}>
                  <label className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-white/5 transition">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(key)}
                      className="h-3.5 w-3.5 rounded accent-indigo-500"
                    />
                    <span className="text-xs text-white/70">{col.header}</span>
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

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
export function DataTable<T extends object>({
  data,
  columns,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  caption,
  onRowClick,
  globalSearch = true,
  columnToggle = true,
  className,
  loading = false,
  emptyMessage = "Nenhum dado encontrado.",
}: DataTableProps<T>) {
  // ── State ──
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [visibleCols, setVisibleCols] = useState<Set<string>>(
    () => new Set(columns.map((c) => String(c.accessorKey)))
  );

  // ── Form (react-hook-form + zod) ──
  const { control, watch, setValue } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { globalQuery: "", columnFilters: {} },
  });

  const globalQuery = watch("globalQuery") ?? "";

  // FIX 1: cast explícito para Record<string, string>
  // O RHF infere o valor do registo como o tipo genérico do form (FieldValues),
  // que pode ser resolvido como {} pelo compilador TypeScript.
  // O cast é seguro porque o schema Zod garante string no runtime.
  const columnFilters = (watch("columnFilters") ?? {}) as Record<
    string,
    string
  >;

  // ── Visible columns ──
  const visibleColumns = useMemo(
    () => columns.filter((c) => visibleCols.has(String(c.accessorKey))),
    [columns, visibleCols]
  );

  const toggleColumn = useCallback((key: string) => {
    setVisibleCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size === 1) return prev; // manter pelo menos uma coluna visível
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // ── Sort handler ──
  const handleSort = useCallback(
    (key: string) => {
      if (sortKey !== key) {
        setSortKey(key);
        setSortDir("asc");
      } else {
        setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
        if (sortDir === "desc") setSortKey(null);
      }
      setPage(1);
    },
    [sortKey, sortDir]
  );

  // ── Pipeline: filter → sort → paginate ──
  const processed = useMemo(() => {
    let rows = [...data];

    // Filtro global
    if (globalQuery) {
      rows = rows.filter((row) =>
        columns.some((col) => {
          const val = getNestedValue(row, String(col.accessorKey));
          return matchesFilter(val, globalQuery);
        })
      );
    }

    // Filtros por coluna
    // FIX 2: guarda typeof query === "string" elimina definitivamente o erro
    // "Argument of type '{}' is not assignable to parameter of type 'string'"
    // mesmo que o cast acima não seja suficiente nalguns cenários de strict mode.
    Object.entries(columnFilters).forEach(([key, query]) => {
      if (!query || typeof query !== "string") return;
      rows = rows.filter((row) => {
        const val = getNestedValue(row, key);
        return matchesFilter(val, query);
      });
    });

    // Ordenação
    if (sortKey && sortDir) {
      rows.sort((a, b) => {
        const av = getNestedValue(a, sortKey);
        const bv = getNestedValue(b, sortKey);
        const aStr = String(av ?? "");
        const bStr = String(bv ?? "");
        const cmp =
          isNaN(Number(aStr)) || isNaN(Number(bStr))
            ? aStr.localeCompare(bStr)
            : Number(aStr) - Number(bStr);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return rows;
  }, [data, columns, globalQuery, columnFilters, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(processed.length / pageSize));

  const paged = useMemo(
    () => processed.slice((page - 1) * pageSize, page * pageSize),
    [processed, page, pageSize]
  );

  const handlePageSizeChange = useCallback((s: number) => {
    setPageSize(s);
    setPage(1);
  }, []);

  // ─────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────
  return (
    <div
      className={clsx(
        "relative flex flex-col rounded-2xl border border-white/[0.07] bg-[#0f1117] text-white shadow-2xl shadow-black/60 overflow-hidden font-[system-ui,sans-serif]",
        className
      )}
    >
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
        {caption && (
          <h2 className="text-sm font-semibold text-white/80 tracking-tight sm:mr-auto">
            {caption}
          </h2>
        )}

        {globalSearch && (
          <Controller
            control={control}
            name="globalQuery"
            render={({ field }) => (
              <div className="relative flex-1 max-w-xs">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/30">
                  <IconSearch />
                </span>
                <input
                  {...field}
                  placeholder="Pesquisar…"
                  onChange={(e) => {
                    field.onChange(e);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition"
                />
                {field.value && (
                  <button
                    type="button"
                    onClick={() => {
                      setValue("globalQuery", "");
                      setPage(1);
                    }}
                    className="absolute inset-y-0 right-2.5 flex items-center text-white/30 hover:text-white/60 transition"
                  >
                    <IconClose />
                  </button>
                )}
              </div>
            )}
          />
        )}

        {columnToggle && (
          <ColumnToggle
            columns={columns}
            visible={visibleCols}
            onToggle={toggleColumn}
          />
        )}
      </div>

      {/* ── Table wrapper ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {visibleColumns.map((col) => {
                const key = String(col.accessorKey);
                const dir: SortDirection = sortKey === key ? sortDir : null;
                return (
                  <th
                    key={key}
                    style={{ width: col.width }}
                    className={clsx(
                      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40 select-none",
                      col.sortable &&
                        "cursor-pointer hover:text-white/70 transition-colors",
                      col.className
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
            </tr>

            {/* Linha de filtros por coluna */}
            {visibleColumns.some((c) => c.filterable) && (
              <tr className="border-b border-white/[0.04] bg-white/[0.015]">
                {visibleColumns.map((col) => {
                  const key = String(col.accessorKey);
                  return (
                    <td key={key} className="px-3 py-1.5">
                      {col.filterable ? (
                        <Controller
                          control={control}
                          name={`columnFilters.${key}`}
                          render={({ field }) => (
                            <input
                              {...field}
                              value={field.value ?? ""}
                              placeholder={`Filtrar ${col.header}…`}
                              onChange={(e) => {
                                field.onChange(e);
                                setPage(1);
                              }}
                              className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition"
                            />
                          )}
                        />
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            )}
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="py-20 text-center"
                >
                  <div className="flex flex-col items-center gap-3 text-white/30">
                    <IconSpinner />
                    <span className="text-xs">A carregar…</span>
                  </div>
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="py-20 text-center text-xs text-white/30"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick?.(row)}
                  className={clsx(
                    "border-b border-white/[0.04] transition-colors duration-100",
                    onRowClick && "cursor-pointer",
                    rowIdx % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]",
                    "hover:bg-indigo-500/[0.07]"
                  )}
                >
                  {visibleColumns.map((col) => {
                    const key = String(col.accessorKey);
                    const value = getNestedValue(row, key);
                    return (
                      <td
                        key={key}
                        className={clsx(
                          "px-4 py-3 text-sm text-white/70 align-middle",
                          col.className
                        )}
                      >
                        {col.cell ? col.cell(value, row) : String(value ?? "—")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <Pagination
        page={page}
        pageCount={pageCount}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        total={processed.length}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

export default DataTable;
