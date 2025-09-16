// src/mocks/members.mock.ts

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-01
  최종 수정일 : 2025-09-01
*/

import { Member } from "@/types/member.type";

export const MEMBERS: Member[] = [
  {
    id: 1,
    name: "홍길동",
    email: "hong@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "기획",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "김은혜",
    email: "eunhye@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "디자인",
    status: "INACTIVE",
  },
  {
    id: 3,
    name: "이영희",
    email: "yonghee@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "개발",
    status: "ACTIVE",
  },
  {
    id: 4,
    name: "박철수",
    email: "chulsoo@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "마케팅",
    status: "INACTIVE",
  },
  {
    id: 5,
    name: "최재원",
    email: "jaewon@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "개발",
    status: "ACTIVE",
  },
  {
    id: 6,
    name: "김민지",
    email: "minji@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "디자인",
    status: "INACTIVE",
  },
  {
    id: 7,
    name: "이지은",
    email: "jiwon@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "마케팅",
    status: "ACTIVE",
  },
  {
    id: 8,
    name: "박준서",
    email: "junseo@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "개발",
    status: "INACTIVE",
  },
];

export const DONUT_CHART_DATA = [
  { name: "기획", value: 100 },
  { name: "디자인", value: 200 },
  { name: "개발", value: 300 },
];

export const BAR_CHART_DATA = [{ month: "1월", value: 100 }];
