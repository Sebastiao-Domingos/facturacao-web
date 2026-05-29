// ═══════════════════════════════════════════════════════════════════════════════
//  TYPES — DataTableV3
// ═══════════════════════════════════════════════════════════════════════════════

export type SortDirection = "asc" | "desc" | null;
export type Density = "compact" | "normal" | "relaxed";
export type ActionVariant = "default" | "danger" | "warning" | "success";
export type BuiltinAction = "view" | "edit" | "delete";

export interface ColumnDef<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
  width?: number;
  hidden?: boolean;
}

export interface CustomAction<T> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  hidden?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  variant?: ActionVariant;
  onClick: (row: T) => void;
}

export interface ServerPaginationConfig {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface ServerSearchConfig {
  onSearch: (query: string) => void;
  debounce?: number;
  placeholder?: string;
  searching?: boolean;
}

export interface DataTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey?: keyof T | ((row: T) => string);

  // Actions
  actions?: BuiltinAction[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  customActions?: CustomAction<T>[];

  // Selection
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  bulkActions?: CustomAction<T[]>[];

  // Pagination
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  serverPagination?: ServerPaginationConfig;

  // Search
  globalSearch?: boolean;
  serverSearch?: ServerSearchConfig;

  // UI
  caption?: string;
  onRowClick?: (row: T) => void;
  columnToggle?: boolean;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  showCount?: boolean;
  density?: Density;
}
