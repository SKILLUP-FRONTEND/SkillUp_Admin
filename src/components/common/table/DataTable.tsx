// src/components/common/table/DataTable.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/

import styles from "./DataTable.module.css";

interface ColumnDef<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T) => React.ReactNode;
  onClick?: () => void;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  emptyText?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  emptyText = "데이터가 없습니다.",
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={styles.dataTable}>
      <table>
        <thead className={styles.dataTableHeader}>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.dataTableRowEmpty}>
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={idx}
                className={styles.dataTableRow}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles.dataTableRowCell}>
                    {col.render
                      ? col.render(item)
                      : (item[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
