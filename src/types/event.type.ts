// src/types/event.type.ts

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/

export type EventStatus =
  | "RECRUITING"
  | "RECRUITING_EXPECTED"
  | "RECRUITING_CLOSED"
  | "ENDED";

export interface Event {
  id: number;
  title: string;
  category: string;
  period: string;
  views: number;
  likes: number;
  status: EventStatus;
  createdAt: string;
}
