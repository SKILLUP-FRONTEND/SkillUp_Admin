// src/app/(admin)/events/EventsPageContent.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/
"use client";

import SummaryCard from "@/components/events/SummaryCard";
import styles from "./events.module.css";
import ToggleSwitch from "@/components/common/toggle/ToggleSwitch";
import CategoryFilterTabs from "@/components/common/filter/CategoryFilterTabs";
import { useState } from "react";
import SearchInput from "@/components/common/input/SearchInput";
import { DataTable } from "@/components/common/table/DataTable";

import { EVENTS } from "@/mocks/events.mock";
import Pagination from "@/components/common/pagination/Pagination";
import StatusBadge from "@/components/common/badge/StatusBadge";
import { Event } from "@/types/event.type";
import Dropdown from "@/components/common/dropdown/Dropdown";

const mockEvents = EVENTS;

const categories = [
  { label: "전체", count: 150, value: "all" },
  { label: "컨퍼런스/세미나", count: 40, value: "conference" },
  { label: "공모전/해커톤", count: 32, value: "competition" },
  { label: "부트캠프/동아리", count: 78, value: "bootcamp" },
  { label: "네트워킹/멘토링", count: 78, value: "networking" },
];

const eventColumns = [
  { key: "id", header: "No", width: "50px" },
  { key: "title", header: "행사명", width: "200px" },
  { key: "category", header: "카테고리", width: "150px" },
  { key: "period", header: "행사 기간", width: "200px" },
  { key: "views", header: "조회수", width: "80px" },
  { key: "likes", header: "관심수", width: "80px" },
  {
    key: "status",
    header: "상태",
    width: "100px",
    render: (item: Event) => <StatusBadge status={item.status} />,
  },
  { key: "createdAt", header: "등록일", width: "160px" },
];

export default function EventsPageContent() {
  const [selected, setSelected] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const onSelect = (value: string) => {
    setSelected(value);
  };

  return (
    <div className={styles.eventsSection}>
      <div className={styles.eventsHeader}>
        <div className={styles.eventsHeaderTop}>
          <h1 className={styles.eventsTitle}>행사관리</h1>
          <button className={styles.eventsButton}>등록하기</button>
        </div>
        <ToggleSwitch label="종료된 행사 포함" />
        <div className={styles.dashBoardSummary}>
          <SummaryCard items={[{ title: "등록된 행사", count: 200 }]} />
          <SummaryCard
            items={[
              { title: "모임예정 행사", count: 88 },
              { title: "모집중인 행사", count: 122 },
              { title: "모집마감 행사", count: 13 },
              { title: "진행중인 행사", count: 88 },
            ]}
          />
          <SummaryCard items={[{ title: "등록 가능한 행사 수", count: 23 }]} />
        </div>
      </div>
      <div className={styles.eventsTable}>
        <div className={styles.eventsTableFilter}>
          <CategoryFilterTabs
            categories={categories}
            selected={selected}
            onSelect={onSelect}
          />
          <SearchInput />
        </div>
        <div className={styles.eventsTableMain}>
          <div className={styles.eventsTableHeader}>
            <div className={styles.eventsTableHeaderLeft}>
              <h5 className={styles.eventsTableHeaderTitle}>등록된 행사</h5>
              <h5 className={styles.eventsTableHeaderTitle}>
                {mockEvents.length}개
              </h5>
            </div>
            <div className={styles.eventsTableHeaderRight}>
              <Dropdown
                options={[
                  { label: "전체", value: "all" },
                  { label: "모임예정 행사", value: "RECRUITING_EXPECTED" },
                  { label: "모집중인 행사", value: "RECRUITING" },
                  { label: "모집마감 행사", value: "RECRUITING_CLOSED" },
                  { label: "진행중인 행사", value: "ENDED" },
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="상태 선택"
              />
            </div>
          </div>
          <DataTable
            columns={eventColumns}
            data={mockEvents.slice((currentPage - 1) * 5, currentPage * 5)}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(mockEvents.length / 5)}
            onPageChange={(page) => {
              setCurrentPage(page);
            }}
            hideIfSinglePage={false}
          />
        </div>
      </div>
    </div>
  );
}
