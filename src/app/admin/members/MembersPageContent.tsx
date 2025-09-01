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
import MemberTable from "@/components/members/MemberTable";
import MemberPagination from "@/components/members/MemberPagination";
import { MEMBERS } from "@/mocks/members.mock";

export default function MembersPageContent() {
  const [selected, setSelected] = useState("all");

  const onSelect = (key: string) => {
    setSelected(key);
  };

  const members = MEMBERS;

  return (
    <section className={styles.membersSection}>
      <div className={styles.membersHeader}>
        <h1 className={styles.membersTitle}>회원관리</h1>
        <MemberFilterToggle />
      </div>
      <div className={styles.membersTable}>
        <div className={styles.membersTableFilter}>
          <MemberFilterTabs selected={selected} onSelect={onSelect} />
          <MemberSearchInput />
        </div>

        <div className={styles.membersTableMain}>
          <div className={styles.membersTableHeader}>
            <h5 className={styles.membersTableHeaderTitle}>회원</h5>
            <h5 className={styles.membersTableHeaderTitle}>
              {members.length}명
            </h5>
          </div>
          <MemberTable members={members} />
          <MemberPagination />
        </div>
      </div>
    </section>
  );
}
