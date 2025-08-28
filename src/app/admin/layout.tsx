// src/app/admin/layout.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/

import { ReactNode } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import styles from "./adminLayout.module.css";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <AdminSidebar />
      <div className={styles.contentArea}>
        <AdminHeader />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
