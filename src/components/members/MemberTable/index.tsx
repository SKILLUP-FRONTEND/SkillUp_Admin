// src/components/members/MemberTable/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-31
  최종 수정일 : 2025-08-31
*/

import MemberHeader from "../MemberHeader";
import styles from "./style.module.css";
import MemberTableRow from "../MemberTableRow";

export default function MemberTable() {
  return (
    <div className={styles.memberTable}>
      <table>
        <MemberHeader />
        {/* TODO : 추후 서버에서 받은 데이터로 변경 */}
        <tbody>
          {Array.from({ length: 10 }).map((_, index) => (
            <MemberTableRow key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
