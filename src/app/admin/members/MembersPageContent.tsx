// src/app/admin/members/MembersPageContent.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-31
*/

"use client";

import styles from "./members.module.css";
import { useState } from "react";
import { MEMBERS } from "@/mocks/members.mock";
import ToggleSwitch from "@/components/common/toggle/ToggleSwitch";
import CategoryFilterTabs from "@/components/common/filter/CategoryFilterTabs";
import SearchInput from "@/components/common/input/SearchInput";
import { DataTable } from "@/components/common/table/DataTable";
import { Member } from "@/types/member";
import Pagination from "@/components/common/pagination/Pagination";

export default function MembersPageContent() {
  const [selected, setSelected] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const onSelect = (key: string) => {
    setSelected(key);
  };

  const categories = [
    { label: "전체", count: 150, value: "all" },
    { label: "기획", count: 40, value: "plan" },
    { label: "디자인", count: 32, value: "design" },
    { label: "개발", count: 78, value: "dev" },
  ];

  const userColumns = [
    { key: "id", header: "No", width: "50px" },
    { key: "name", header: "이름", width: "100px" },
    { key: "email", header: "이메일", width: "220px" },
    { key: "createdAt", header: "가입일", width: "180px" },
    { key: "loginMethod", header: "로그인 방법", width: "100px" },
    { key: "job", header: "직군", width: "100px" },
    {
      key: "status",
      header: "상태",
      width: "80px",
      render: (item: Member) => (
        <div className="flex gap-1">
          <button className="btn-sm">
            {item.status === "active" ? "활동" : "탈퇴"}
          </button>
        </div>
      ),
    },
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
          <SearchInput />
        </div>

        <div className={styles.membersTableMain}>
          <div className={styles.membersTableHeader}>
            <h5 className={styles.membersTableHeaderTitle}>회원</h5>
            <h5 className={styles.membersTableHeaderTitle}>
              {members.length}명
            </h5>
          </div>
          <DataTable
            columns={userColumns}
            data={members.slice((currentPage - 1) * 5, currentPage * 5)}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(members.length / 5)}
            onPageChange={(page) => {
              setCurrentPage(page);
            }}
            hideIfSinglePage={false}
          />
        </div>
      </div>
    </section>
  );
}
