// src/components/members/MemberFilterToggle/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-31
  최종 수정일 : 2025-08-31
*/

"use client";

import { useState } from "react";
import styles from "./style.module.css";

export default function MemberFilterToggle() {
  const [checked, setChecked] = useState(false);

  const onChange = (checked: boolean) => {
    setChecked(checked);
  };

  return (
    <label className={styles.toggleWrapper}>
      <span className={styles.labelText}>탈퇴 회원 포함</span>
      <div
        className={`${styles.toggle} ${checked ? styles.active : ""}`}
        onClick={() => onChange(!checked)}
      >
        <div className={styles.circle} />
      </div>
    </label>
  );
}
