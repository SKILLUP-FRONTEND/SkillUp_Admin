// src/components/members/MemberHeader/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-31
  최종 수정일 : 2025-08-31
*/

import styles from "./style.module.css";

export default function MemberHeader() {
  return (
    <thead className={styles.memberHeader}>
      <tr>
        <th>NO</th>
        <th>이름</th>
        <th>이메일</th>
        <th>가입일</th>
        <th>로그인 방법</th>
        <th>직군</th>
        <th>상태</th>
      </tr>
    </thead>
  );
}
