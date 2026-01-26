// DataTable.tsx
import React, {ReactElement, ReactNode} from "react";
import styles from "./DataTable.module.scss";
import {DataTableColumnProps} from "./DataTableColumn";

interface DataTableProps<T> {
    data: T[];
    emptyText?: string;
    onRowClick?: (row: T) => void;
    children: ReactNode;
}

export function DataTable<T>({
                                 data,
                                 emptyText = "데이터가 없습니다.",
                                 onRowClick,
                                 children,
                             }: DataTableProps<T>) {

    // ⭐ children → column 정의 추출
    const columns = React.Children.toArray(children)
        .filter(Boolean)
        .map((child) => {
            const element = child as ReactElement<DataTableColumnProps<T>>;
            return element.props;
        });

    return (
        <table className={styles.tableDefault}>
            <thead>
            <tr>
                {columns.map((col,index) => (
                    <th key={index} style={{width: col.width}}>
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
                        key={rowIndex}
                        className={styles.dataTableRow}
                        onClick={() => onRowClick?.(row)}
                    >
                        {columns.map((col,index) => (
                            <td key={index}>
                                <div className={styles.tableCell}>
                                    {typeof col.children === "function"
                                        ? col.children(row, rowIndex)
                                        : col.children ?? (row[col.prop as keyof T] as React.ReactNode)}
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
