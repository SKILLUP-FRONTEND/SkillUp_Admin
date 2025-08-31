// src/app/admin/members/MembersPageContent.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-31
*/

"use client";

import MemberFilterToggle from "@/components/members/MemberFilterToggle";
import MemberFilterTabs from "@/components/members/MemberFilterTabs";
import MemberSearchInput from "@/components/members/MemberSearchInput";
import styles from "./members.module.css";
import { useState } from "react";

export default function MembersPageContent() {
  const [selected, setSelected] = useState("all");

  const onSelect = (key: string) => {
    setSelected(key);
  };

  return (
    <section className={styles.membersSection}>
      <div className={styles.membersHeader}>
        <h2 className={styles.membersTitle}>회원관리</h2>
        <MemberFilterToggle />
      </div>
      {/* TODO : 테이블 전체 부분 */}
      <div className={styles.membersTable}>
        <div className={styles.membersTableFilter}>
          <MemberFilterTabs selected={selected} onSelect={onSelect} />
          <MemberSearchInput />
        </div>

        {/* TODO : 테이블 메인 부분 */}

        {/* TODO : 테이블 페이지네이션 부분 */}
      </div>
    </section>
  );
}
