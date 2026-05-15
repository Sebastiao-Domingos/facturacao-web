import { useState, useEffect, useCallback, useMemo, useId } from "react";
import type { ColumnDef, SortDirection } from "@/src/types/table";

// ─── Nested value accessor ────────────────────────────────────────────────────

export function getNestedValue<T extends object>(obj: T, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc !== null && typeof acc === "object")
      return (acc as Record<string, unknown>)[part];
    return undefined;
  }, obj);
}

// ─── Row key (stable — sem Math.random) ──────────────────────────────────────

export function resolveRowKey<T extends object>(
  row: T,
  rowKey: keyof T | ((row: T) => string) | undefined,
  fallbackId: string, // useId() prefix
  index: number
): string {
  if (!rowKey) return `${fallbackId}-${index}`;
  if (typeof rowKey === "function") return rowKey(row);
  const v = (row as Record<string, unknown>)[rowKey as string];
  return v !== undefined && v !== null ? String(v) : `${fallbackId}-${index}`;
}

// ─── Filter ──────────────────────────────────────────────────────────────────

export function matchesFilter(value: unknown, query: string): boolean {
  if (!query) return true;
  return String(value ?? "")
    .toLowerCase()
    .includes(query.toLowerCase());
}

// ─── Debounce ─────────────────────────────────────────────────────────────────

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Sort state ───────────────────────────────────────────────────────────────

export function useSortState() {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const handleSort = useCallback((key: string, resetPage: () => void) => {
    setSortKey((prev) => {
      if (prev !== key) {
        setSortDir("asc");
        return key;
      }
      setSortDir((d) => {
        if (d === "asc") return "desc";
        // desc → null: clear sort
        setSortKey(null);
        return null;
      });
      return prev;
    });
    resetPage();
  }, []);

  return { sortKey, sortDir, handleSort };
}

// ─── Column visibility ────────────────────────────────────────────────────────

export function useColumnVisibility<T>(columns: ColumnDef<T>[]) {
  const [visibleCols, setVisibleCols] = useState<Set<string>>(
    () =>
      new Set(
        columns.filter((c) => !c.hidden).map((c) => String(c.accessorKey))
      )
  );

  const visibleColumns = useMemo(
    () => columns.filter((c) => visibleCols.has(String(c.accessorKey))),
    [columns, visibleCols]
  );

  const toggleColumn = useCallback((key: string) => {
    setVisibleCols((prev) => {
      if (prev.size === 1 && prev.has(key)) return prev; // mínimo 1 coluna
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  return { visibleCols, visibleColumns, toggleColumn };
}

// ─── Selection (fully controlled OR fully uncontrolled) ───────────────────────

export function useSelection<T extends object>(
  data: T[],
  rowKey: keyof T | ((row: T) => string) | undefined,
  fallbackId: string,
  externalSelected: T[] | undefined,
  onSelectionChange: ((rows: T[]) => void) | undefined
) {
  const isControlled = externalSelected !== undefined;

  const [internalKeys, setInternalKeys] = useState<Set<string>>(new Set());

  const resolveKey = useCallback(
    (row: T, index: number) => resolveRowKey(row, rowKey, fallbackId, index),
    [rowKey, fallbackId]
  );

  // Chaves seleccionadas (fonte única de verdade)
  const selectedKeys = useMemo(() => {
    if (isControlled) {
      return new Set((externalSelected ?? []).map((r, i) => resolveKey(r, i)));
    }
    return internalKeys;
  }, [isControlled, externalSelected, internalKeys, resolveKey]);

  const selectedRowObjects = useMemo(
    () => data.filter((r, i) => selectedKeys.has(resolveKey(r, i))),
    [data, selectedKeys, resolveKey]
  );

  const setKeys = useCallback(
    (updater: (prev: Set<string>) => Set<string>, newRows: T[]) => {
      if (!isControlled) {
        setInternalKeys(updater);
      }
      onSelectionChange?.(newRows);
    },
    [isControlled, onSelectionChange]
  );

  const toggleRow = useCallback(
    (row: T, index: number, selected: boolean) => {
      const key = resolveKey(row, index);
      const nextRows = selected
        ? [...selectedRowObjects, row]
        : selectedRowObjects.filter((_, i) => resolveKey(_, i) !== key);
      setKeys((prev) => {
        const next = new Set(prev);
        selected ? next.add(key) : next.delete(key);
        return next;
      }, nextRows);
    },
    [resolveKey, selectedRowObjects, setKeys]
  );

  const toggleAll = useCallback(
    (allKeys: string[], checked: boolean) => {
      if (checked) {
        setKeys(() => new Set(allKeys), data);
      } else {
        setKeys(() => new Set(), []);
      }
    },
    [data, setKeys]
  );

  const clearSelection = useCallback(() => {
    setKeys(() => new Set(), []);
  }, [setKeys]);

  return {
    selectedKeys,
    selectedRowObjects,
    toggleRow,
    toggleAll,
    clearSelection,
  };
}

// ─── Local data pipeline ──────────────────────────────────────────────────────

export function useLocalPipeline<T extends object>(
  data: T[],
  columns: ColumnDef<T>[],
  globalQuery: string,
  columnFilters: Record<string, string>,
  sortKey: string | null,
  sortDir: SortDirection,
  isServerSide: boolean
) {
  return useMemo(() => {
    if (isServerSide) return data;

    let rows = [...data];

    // Global filter
    if (globalQuery) {
      const q = globalQuery.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((col) =>
          String(getNestedValue(row, String(col.accessorKey)) ?? "")
            .toLowerCase()
            .includes(q)
        )
      );
    }

    // Per-column filters
    for (const [key, query] of Object.entries(columnFilters)) {
      if (!query) continue;
      rows = rows.filter((row) =>
        matchesFilter(getNestedValue(row, key), query)
      );
    }

    // Sort
    if (sortKey && sortDir) {
      rows.sort((a, b) => {
        const av = getNestedValue(a, sortKey);
        const bv = getNestedValue(b, sortKey);
        const na = Number(av);
        const nb = Number(bv);
        const cmp =
          !isNaN(na) && !isNaN(nb)
            ? na - nb
            : String(av ?? "").localeCompare(String(bv ?? ""));
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
    isServerSide,
  ]);
}
