// src/components/members/MemberTableRow/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-31
  최종 수정일 : 2025-08-31
*/

import styles from "./style.module.css";

export default function MemberTableRow() {
  return (
    <tr className={styles.memberTableRow}>
      <td>
        <div className={styles.ellipsis}>20</div>
      </td>
      <td>
        <div className={styles.ellipsis}>홍길동</div>
      </td>
      <td>
        <div className={styles.ellipsis}>example@gmail.com</div>
      </td>
      <td>
        <div className={styles.ellipsis}>2025/12/12 13:00</div>
      </td>
      <td>
        <div className={styles.ellipsis}>카카오</div>
      </td>
      <td>
        <div className={styles.ellipsis}>기획</div>
      </td>
      {/* TODO : 추후 서버에서 받은 데이터로 변경 */}
      <td>
        <span className={`${styles.statusBadge} ${styles.inactive}`}>
          {"탈퇴"}
        </span>
      </td>
    </tr>
  );
}
