// src/app/admin/members/MembersPageContent.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-31
*/

"use client";

import MemberSearchInput from "@/components/members/MemberSearchInput";
import styles from "./members.module.css";
import { useState } from "react";
import MemberTable from "@/components/members/MemberTable";
import MemberPagination from "@/components/members/MemberPagination";
import { MEMBERS } from "@/mocks/members.mock";
import ToggleSwitch from "@/components/common/toggle/ToggleSwitch";
import CategoryFilterTabs from "@/components/common/filter/CategoryFilterTabs";

export default function MembersPageContent() {
  const [selected, setSelected] = useState("all");

  const onSelect = (key: string) => {
    setSelected(key);
  };

  const categories = [
    { label: "전체", count: 150, value: "all" },
    { label: "기획", count: 40, value: "plan" },
    { label: "디자인", count: 32, value: "design" },
    { label: "개발", count: 78, value: "dev" },
  ];

  const members = MEMBERS;

  return (
    <section className={styles.membersSection}>
      <div className={styles.membersHeader}>
        <h1 className={styles.membersTitle}>회원관리</h1>
        <ToggleSwitch label="탈퇴 회원 포함" />
      </div>
      <div className={styles.membersTable}>
        <div className={styles.membersTableFilter}>
          <CategoryFilterTabs
            categories={categories}
            selected={selected}
            onSelect={onSelect}
          />
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
