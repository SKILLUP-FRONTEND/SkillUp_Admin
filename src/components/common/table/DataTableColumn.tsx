// DataTableColumn.tsx

export interface DataTableColumnProps<T> {
    prop?: keyof T;
    label: string;
    width?: number;

    children?: React.ReactNode | ((row: T,index?: number,drag?:DragHandleContext) => React.ReactNode);
}
export function DataTableColumn<T>(_: DataTableColumnProps<T>) {
    return null;
}

export interface DragHandleContext {
    startDrag: (e: React.DragEvent) => void;
}
