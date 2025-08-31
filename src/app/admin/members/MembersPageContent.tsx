// src/app/admin/members/MembersPageContent.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-31
*/

import MemberFilterToggle from "@/components/members/MemberFilterToggle";
import styles from "./members.module.css";

export default function MembersPageContent() {
  return (
    <section className={styles.membersSection}>
      <div className={styles.membersHeader}>
        <h2 className={styles.membersTitle}>회원관리</h2>
        {/* TODO : 필터링 */}
        <MemberFilterToggle />
      </div>
      {/* TODO : 테이블 전체 부분 */}
      <div className={styles.membersTable}>
        {/* TODO : 테이블 필터, 검색 부분 */}
        {/* TODO : 테이블 메인 부분 */}

        {/* TODO : 테이블 페이지네이션 부분 */}
      </div>
    </section>
  );
}
