// DataTableColumn.tsx

export interface DataTableColumnProps<T> {
    prop?: keyof T;
    label: string;
    width?: string;
    children?: React.ReactNode | ((row: T,index?: number) => React.ReactNode);
}
export function DataTableColumn<T>(_: DataTableColumnProps<T>) {
    return null;
}
