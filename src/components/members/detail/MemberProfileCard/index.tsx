// src/components/members/detail/MemberProfileCard/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-02
  최종 수정일 : 2025-09-02
*/

import styles from "./style.module.css";
import Field from "../Field";

export default function MemberProfileCard() {
  return (
    <div className={styles.memberProfileCard}>
      <div className={styles.memberProfileCardHeader}>
        <span className={styles.memberProfileCardHeaderStatus}>활성</span>
        <h3 className={styles.memberProfileCardHeaderTitle}>홍길동</h3>
      </div>
      <div className={styles.memberProfileCardBody}>
        <Field label="이메일" value="hong@gmail.com" />
        <Field label="직군" value="기획" />
        <Field label="가입일" value="2020/12/12 15:00" />
        <Field label="로그인 방법" value="카카오 로그인" />
        <Field label="최근 접속 시간" value="2025/12/12 15:00" />
      </div>
    </div>
  );
}
