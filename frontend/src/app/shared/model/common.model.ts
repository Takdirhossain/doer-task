export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  format?: (value: any, row: any) => string;
  class?: string;
}

export interface TableAction {
  icon: string;
  tooltip: string;
  color?: 'primary' | 'accent' | 'warn';
  callback: (row: any) => void;
  condition?: (row: any) => boolean;
}

export interface TableConfig {
  columns: TableColumn[];
  actions?: TableAction[];
  showActions?: boolean;
}
