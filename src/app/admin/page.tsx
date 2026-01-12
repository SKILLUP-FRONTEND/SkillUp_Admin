// src/app/admin/page.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/

import { redirect } from "next/navigation";

export default function AdminHome() {
  redirect("/admin/events");
}
