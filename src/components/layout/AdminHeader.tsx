// src/components/layout/AdminHeader.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/

import Image from "next/image";
import styles from "./adminLayout.module.css";
import bellIcon from "@/assets/bellIcon.svg";

export default function AdminHeader() {
  return (
    <header className={styles.adminHeader}>
      <div className={styles.adminHeaderRight}>
        <div className={styles.adminHeaderNotification}>
          <Image src={bellIcon} alt="bell" width={16} height={16} />
          <div className={styles.adminHeaderNotificationCount}>1</div>
        </div>
        <h5>관리자 이름</h5>
      </div>
    </header>
  );
}
