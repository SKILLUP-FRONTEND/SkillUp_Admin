// src/components/members/MemberSearchInput/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-31
  최종 수정일 : 2025-08-31
*/

import styles from "./style.module.css";

export default function MemberSearchInput() {
  return (
    <div className={styles.searchInputWrapper}>
      <input type="text" placeholder="Search" className={styles.searchInput} />
    </div>
  );
}
