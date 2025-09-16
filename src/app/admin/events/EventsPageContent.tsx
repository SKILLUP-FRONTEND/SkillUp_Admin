// src/app/admin/events/EventsPageContent.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/
"use client";

import SummaryCard from "@/components/events/SummaryCard";
import styles from "./events.module.css";
import ToggleSwitch from "@/components/common/toggle/ToggleSwitch";

export default function EventsPageContent() {
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
    </div>
  );
}
