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
  accessorKey: keyof T | string;
  header: string;
  cell?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
  width?: number;
}

export interface DataTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  caption?: string;
  onRowClick?: (row: T) => void;
  globalSearch?: boolean;
  columnToggle?: boolean;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
}

// ─────────────────────────────────────────────
//  ZOD SCHEMA
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
//  ICONS
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
    <span className="ml-1.5 flex flex-col gap-px opacity-50">
      {/* Usa a variável --table-sort-active via style inline para compatibilidade */}
      <span
        style={{
          color: direction === "asc" ? "var(--table-sort-active)" : undefined,
        }}
      >
        <IconChevronUp />
      </span>
      <span
        style={{
          color: direction === "desc" ? "var(--table-sort-active)" : undefined,
        }}
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

  return (
    <div
      className="flex flex-col sm:flex-row items-center gap-3 px-4 py-3"
      style={{ borderTop: "1px solid var(--table-border)" }}
    >
      {/* Contagem */}
      <p
        className="text-xs tabular-nums sm:mr-auto"
        style={{ color: "var(--table-muted)" }}
      >
        {total === 0 ? "Sem resultados" : `${start}–${end} de ${total}`}
      </p>

      {/* Botões de página */}
      <div className="flex items-center gap-1">
        {/* Anterior */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Página anterior"
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-40"
          style={
            {
              background: "var(--table-pagination-btn)",
              color: "var(--table-muted)",
              "--tw-ring-color": "var(--ring)",
            } as React.CSSProperties
          }
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "var(--table-pagination-btn-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--table-pagination-btn)")
          }
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Páginas */}
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 text-center text-xs"
              style={{ color: "var(--table-muted)" }}
            >
              …
            </span>
          ) : (
            <PaginationButton
              key={p}
              page={p as number}
              isActive={page === p}
              onClick={() => onPageChange(p as number)}
            />
          )
        )}

        {/* Próxima */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Próxima página"
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-40"
          style={
            {
              background: "var(--table-pagination-btn)",
              color: "var(--table-muted)",
            } as React.CSSProperties
          }
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "var(--table-pagination-btn-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--table-pagination-btn)")
          }
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

      {/* Linhas por página */}
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        aria-label="Linhas por página"
        className="h-8 rounded-lg px-2 text-xs focus:outline-none focus:ring-2 transition-colors"
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

// Botão de página isolado para gerir hover com estado activo
function PaginationButton({
  page,
  isActive,
  onClick,
}: {
  page: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const bg = isActive
    ? "var(--table-pagination-active-bg)"
    : hovered
    ? "var(--table-pagination-btn-hover)"
    : "var(--table-pagination-btn)";

  const color = isActive
    ? "var(--table-pagination-active-fg)"
    : "var(--table-muted)";

  return (
    <button
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2"
      style={{ background: bg, color }}
    >
      {page}
    </button>
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
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2"
        style={{
          background: "var(--table-toggle-bg)",
          border: "1px solid var(--table-border)",
          color: "var(--table-muted)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--table-toggle-bg-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--table-toggle-bg)")
        }
      >
        <IconColumns />
        Colunas
      </button>

      {open && (
        <div
          className="absolute right-0 z-30 mt-2 w-48 rounded-xl shadow-2xl overflow-hidden"
          style={{
            background: "var(--table-toggle-panel)",
            border: "1px solid var(--table-border)",
          }}
        >
          {/* Header do painel */}
          <div
            className="flex items-center justify-between px-3 py-2"
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
              className="transition-colors"
              style={{ color: "var(--table-muted)" }}
            >
              <IconClose />
            </button>
          </div>

          {/* Lista */}
          <ul className="py-1">
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
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(key)}
                      className="h-3.5 w-3.5 rounded"
                      style={{ accentColor: "var(--primary)" }}
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

  // ── Form ──
  const { control, watch, setValue } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { globalQuery: "", columnFilters: {} },
  });

  const globalQuery = watch("globalQuery") ?? "";
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
        if (next.size === 1) return prev;
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // ── Sort ──
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

    if (globalQuery) {
      rows = rows.filter((row) =>
        columns.some((col) => {
          const val = getNestedValue(row, String(col.accessorKey));
          return matchesFilter(val, globalQuery);
        })
      );
    }

    Object.entries(columnFilters).forEach(([key, query]) => {
      if (!query || typeof query !== "string") return;
      rows = rows.filter((row) =>
        matchesFilter(getNestedValue(row, key), query)
      );
    });

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
        "relative flex flex-col overflow-hidden shadow-sm",
        className
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
        className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3"
        style={{
          background: "var(--table-toolbar-bg)",
          borderBottom: "1px solid var(--table-border)",
        }}
      >
        {caption && (
          <h2
            className="text-sm font-semibold tracking-tight sm:mr-auto"
            style={{ color: "var(--table-foreground)" }}
          >
            {caption}
          </h2>
        )}

        {/* Pesquisa global */}
        {globalSearch && (
          <Controller
            control={control}
            name="globalQuery"
            render={({ field }) => (
              <div className="relative flex-1 max-w-xs">
                <span
                  className="pointer-events-none absolute inset-y-0 left-3 flex items-center"
                  style={{ color: "var(--table-muted)" }}
                >
                  <IconSearch />
                </span>
                <input
                  {...field}
                  placeholder="Pesquisar…"
                  onChange={(e) => {
                    field.onChange(e);
                    setPage(1);
                  }}
                  className="w-full rounded-lg py-2 pl-9 pr-8 text-sm transition-colors focus:outline-none focus:ring-2"
                  style={
                    {
                      background: "var(--table-input-bg)",
                      border: "1px solid var(--table-input-border)",
                      color: "var(--table-foreground)",
                      "--tw-ring-color": "var(--ring)",
                    } as React.CSSProperties
                  }
                />
                {field.value && (
                  <button
                    type="button"
                    onClick={() => {
                      setValue("globalQuery", "");
                      setPage(1);
                    }}
                    className="absolute inset-y-0 right-2.5 flex items-center transition-colors"
                    style={{ color: "var(--table-muted)" }}
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

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-sm">
          {/* Cabeçalho */}
          <thead>
            <tr style={{ borderBottom: "1px solid var(--table-border)" }}>
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
                      col.sortable && "cursor-pointer",
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
              <tr style={{ borderBottom: "1px solid var(--table-border)" }}>
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
                            <input
                              {...field}
                              value={field.value ?? ""}
                              placeholder={`Filtrar…`}
                              onChange={(e) => {
                                field.onChange(e);
                                setPage(1);
                              }}
                              className="w-full rounded-md px-2 py-1 text-xs transition-colors focus:outline-none focus:ring-1"
                              style={{
                                background: "var(--table-input-bg)",
                                border: "1px solid var(--table-input-border)",
                                color: "var(--table-foreground)",
                              }}
                            />
                          )}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            )}
          </thead>

          {/* Corpo */}
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="py-20 text-center"
                >
                  <div
                    className="flex flex-col items-center gap-3"
                    style={{ color: "var(--table-muted)" }}
                  >
                    <IconSpinner />
                    <span className="text-xs">A carregar…</span>
                  </div>
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="py-20 text-center text-xs"
                  style={{ color: "var(--table-muted)" }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row, rowIdx) => (
                <TableRow
                  key={rowIdx}
                  row={row}
                  rowIdx={rowIdx}
                  visibleColumns={visibleColumns}
                  onRowClick={onRowClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Paginação ── */}
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

// ─────────────────────────────────────────────
//  TABLE ROW — isolado para gerir hover local
// ─────────────────────────────────────────────
function TableRow<T extends object>({
  row,
  rowIdx,
  visibleColumns,
  onRowClick,
}: {
  row: T;
  rowIdx: number;
  visibleColumns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const bg = hovered
    ? "var(--table-row-hover)"
    : rowIdx % 2 !== 0
    ? "var(--table-row-stripe)"
    : "transparent";

  return (
    <tr
      onClick={() => onRowClick?.(row)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={clsx(
        "transition-colors duration-100",
        onRowClick && "cursor-pointer"
      )}
      style={{
        background: bg,
        borderBottom: "1px solid var(--table-border)",
      }}
    >
      {visibleColumns.map((col) => {
        const key = String(col.accessorKey);
        const value = getNestedValue(row, key);
        return (
          <td
            key={key}
            className={clsx("px-4 py-3 text-sm align-middle", col.className)}
            style={{ color: "var(--table-foreground)" }}
          >
            {col.cell ? col.cell(value, row) : String(value ?? "—")}
          </td>
        );
      })}
    </tr>
  );
}

export default DataTable;
