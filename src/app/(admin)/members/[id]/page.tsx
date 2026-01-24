// src/app/(admin)/members/[id]/page.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-02
  최종 수정일 : 2025-09-02
*/

"use client";

import styles from "./memberDetail.module.css";
import MemberProfileCard from "@/components/members/detail/MemberProfileCard";
import MemberActivityStats from "@/components/members/detail/MemberActivityStats";

export default function MemberDetail() {
  return (
    <div className={styles.memberDetail}>
      <h1 className={styles.memberDetailTitle}>회원 상세</h1>
      <div className={styles.memberDetailContent}>
        <MemberProfileCard />

        <MemberActivityStats />
      </div>
    </div>
  );
}
