// src/types/member.type.ts

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-01
  최종 수정일 : 2025-09-16
*/

export interface AllMemberModel {
  users: MemberModel[];
  devUsers: MemberModel[];
  designerUsers: MemberModel[];
  pmUsers: MemberModel[];
}


export interface MemberModel {
  userId: number;
  name: string;
  email: string;
  createdAt: string;
  socialLoginType: string;
  role: string;
  status: MemberStatus;
}


export type MemberStatus = "ACTIVE" | "INACTIVE";
