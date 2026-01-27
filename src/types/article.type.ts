// src/types/member.type.ts

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-01
  최종 수정일 : 2025-09-16
*/

export interface article {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  loginMethod: string;
  job: string;
  status: ArticleStatus;
}

export type ArticleStatus = "PUBLISHED" | "DRAFT";
