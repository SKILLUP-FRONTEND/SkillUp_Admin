// src/components/events/SummaryCard/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/

import styles from "./style.module.css";

interface SummaryCardItem {
  title: string;
  count: number;
}

interface SummaryCardProps {
  items: SummaryCardItem[];
}

export default function SummaryCard({ items }: SummaryCardProps) {
  return (
    <div className={styles.summaryCard}>
      {items.map((item) => (
        <div className={styles.summaryCardItem} key={item.title}>
          <p className={styles.summaryCardItemTitle}>{item.title}</p>
          <h3 className={styles.summaryCardItemCount}>{item.count}</h3>
        </div>
      ))}
    </div>
  );
}
