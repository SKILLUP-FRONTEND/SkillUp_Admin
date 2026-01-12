// src/components/common/badge/StatusBadge.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/

import styles from "./StatusBadge.module.css";
import { EventStatus } from "@/types/event.type";
import { MemberStatus } from "@/types/member.type";

interface StatusBadgeProps {
  status: EventStatus | MemberStatus;
}

const statusLabelMap: Record<EventStatus | MemberStatus, string> = {
  RECRUITING: "모집중",
  RECRUITING_EXPECTED: "모집예정",
  RECRUITING_CLOSED: "모집마감",
  ENDED: "종료",
  ACTIVE: "활성",
  INACTIVE: "탈퇴",
};

const statusClassMap: Record<EventStatus | MemberStatus, string> = {
  RECRUITING: styles.active,
  RECRUITING_EXPECTED: styles.pending,
  RECRUITING_CLOSED: styles.closed,
  ENDED: styles.disabled,
  ACTIVE: styles.active,
  INACTIVE: styles.inactive,
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.statusBadge} ${statusClassMap[status]}`}>
      {statusLabelMap[status]}
    </span>
  );
}
