// src/components/members/MemberFilterTabs/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-31
  최종 수정일 : 2025-08-31
*/

import styles from "./style.module.css";

interface Tab {
  key: string;
  label: string;
  count: number;
}

interface Props {
  selected: string;
  onSelect: (key: string) => void;
}

const TABS: Tab[] = [
  { key: "all", label: "전체", count: 150 },
  { key: "plan", label: "기획", count: 40 },
  { key: "design", label: "디자인", count: 32 },
  { key: "dev", label: "개발", count: 78 },
];

export default function MemberFilterTabs({ selected, onSelect }: Props) {
  return (
    <div className={styles.tabWrapper}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`${styles.tabItem} ${
            selected === tab.key ? styles.active : ""
          }`}
          onClick={() => onSelect(tab.key)}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
}
