// src/mocks/members.mock.ts

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-01
  최종 수정일 : 2025-09-01
*/

import { Member } from "@/types/member";

export const MEMBERS: Member[] = [
  {
    id: 1,
    name: "홍길동",
    email: "hong@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "기획",
    status: "active",
  },
  {
    id: 2,
    name: "김은혜",
    email: "eunhye@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "디자인",
    status: "inactive",
  },
  {
    id: 3,
    name: "이영희",
    email: "yonghee@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "개발",
    status: "active",
  },
  {
    id: 4,
    name: "박철수",
    email: "chulsoo@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "마케팅",
    status: "inactive",
  },
  {
    id: 5,
    name: "최재원",
    email: "jaewon@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "개발",
    status: "active",
  },
  {
    id: 6,
    name: "김민지",
    email: "minji@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "디자인",
    status: "inactive",
  },
  {
    id: 7,
    name: "이지은",
    email: "jiwon@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "마케팅",
    status: "active",
  },
  {
    id: 8,
    name: "박준서",
    email: "junseo@gmail.com",
    createdAt: "2025-09-01",
    loginMethod: "카카오",
    job: "개발",
    status: "inactive",
  },
];
