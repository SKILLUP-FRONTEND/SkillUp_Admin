// src/app/admin/layout.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/

import { ReactNode } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <AdminSidebar />
      {children}
    </div>
  );
}
