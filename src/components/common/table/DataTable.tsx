// DataTable.tsx
import React, {ReactElement, ReactNode} from "react";
import styles from "./DataTable.module.scss";
import {DataTableColumnProps} from "./DataTableColumn";
import {index} from "d3-array";

interface DataTableProps<T> {
    data: T[];
    emptyText?: string;
    onRowClick?: (row: T) => void;
    draggable?: boolean;
    children: ReactNode;
    onOrderChange?: (newData: T[]) => void;

}

export function DataTable<T extends object>({
                                                data,
                                                emptyText = "데이터가 없습니다.",
                                                onRowClick,
                                                children, draggable,
                                                onOrderChange,
                                            }: DataTableProps<T>) {
    const columns = React.Children.toArray(children)
        .filter(Boolean)
        .map((child) => {
            const element = child as ReactElement<DataTableColumnProps<T>>;
            return element.props;
        });

    const rowRefs = React.useRef<(HTMLTableRowElement | null)[]>([]);
    const [dragIndex, setDragIndex] = React.useState<number | null>(null);

    const handleDragStart = (index: number, e: React.DragEvent) => {
        setDragIndex(index);

        const rowEl = rowRefs.current[index];
        if (rowEl) {
            e.dataTransfer.setDragImage(rowEl, 0, 0);
        }

        e.dataTransfer.effectAllowed = "move";
    };

    const handleDrop = (dropIndex: number) => {
        if (dragIndex === null || dragIndex === dropIndex) return;

        const updated = [...data];
        const [moved] = updated.splice(dragIndex, 1);
        updated.splice(dropIndex, 0, moved);

        onOrderChange?.(updated);
        setDragIndex(null);
    };

    return (
        <table className={`${styles.tableDefault} ${onRowClick && styles.isClickable} `}>
            <thead>
            <tr>
                {columns.map((col, index) => (
                    <th key={index} style={{width: `${col.width}px`}}>
                        <div className={styles.tableCell}>
                            {col.label}
                        </div>
                    </th>
                ))}
            </tr>
            </thead>

            <tbody>
            {data.length === 0 ? (
                <tr>
                    <td colSpan={columns.length}>
                        <div className={styles.boxEmpty}>
                            {emptyText}
                        </div>
                    </td>
                </tr>
            ) : (
                data.map((row, rowIndex) => (
                    <tr
                        ref={(el) => {
                            if (el) {
                                rowRefs.current[rowIndex] = el;
                            }
                        }}
                        key={rowIndex}
                        className={styles.dataTableRow}
                        onClick={() => onRowClick?.(row)}

                        onDragOver={(e) => draggable && e.preventDefault()}
                        onDrop={() => draggable && handleDrop(rowIndex)}
                    >
                        {columns.map((col, index) => (
                            <td key={index}>
                                <div className={styles.tableCell}>

                                    {typeof col.children === "function"
                                        ?
                                        col.children(row, rowIndex, {
                                            startDrag: (e) => handleDragStart(rowIndex, e),
                                        })
                                        : col.children ??
                                        (row[col.prop as keyof T] as React.ReactNode)}
                                </div>
                            </td>
                        ))}
                    </tr>
                ))
            )}
            </tbody>
        </table>
    );
}
