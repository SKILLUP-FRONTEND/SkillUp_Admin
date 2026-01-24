// src/components/common/filter/CategoryFilterTabs.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/

import styles from "./CategoryFilterTabs.module.css";
interface Category {
  label: string;
  count: number;
  value: string;
}

interface CategoryFilterTabsProps {
  categories: Category[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function CategoryFilterTabs({ categories, selected, onSelect }: CategoryFilterTabsProps) {
  return (
    <div className="boxFlex">
      {categories.map((category) => (
        <button
          key={category.value}
          className={`${styles.categoryFilterTab} ${selected === category.value ? styles.active : ""}`}
          onClick={() => onSelect(category.value)}
        >
          {category.label} ({category.count})
        </button>
      ))}
    </div>
  );
}