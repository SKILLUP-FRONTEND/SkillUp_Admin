// src/app/admin/members/[id]/page.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-02
  최종 수정일 : 2025-09-02
*/

"use client";

import styles from "./memberDetail.module.css";
import MemberProfileCard from "@/components/members/detail/MemberProfileCard";

export default function MemberDetail() {
  return (
    <div className={styles.memberDetail}>
      <h1 className={styles.memberDetailTitle}>회원 상세</h1>
      <div className={styles.memberDetailContent}>
        {/* TODO : 회원 상세 내용 */}
        <MemberProfileCard />

        {/* TODO : 회원 활동 내역 차트 */}
      </div>
    </div>
  );
}
