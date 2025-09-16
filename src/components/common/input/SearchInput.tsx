// src/components/common/input/SearchInput.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/

import styles from "./SearchInput.module.css";

export default function SearchInput() {
  return (
    <div className={styles.searchInputWrapper}>
      <input type="text" placeholder="Search" className={styles.searchInput} />
    </div>
  );
}
