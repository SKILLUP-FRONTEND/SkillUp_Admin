// src/components/common/toggle/ToggleSwitch.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/

import { useState } from "react";
import styles from "./ToggleSwitch.module.css";

export default function ToggleSwitch({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);

  const onChange = (checked: boolean) => {
    setChecked(checked);
  };

  return (
    <label className={styles.toggleWrapper}>
      <span className={styles.labelText}>{label}</span>
      <div
        className={`${styles.toggle} ${checked ? styles.active : ""}`}
        onClick={() => onChange(!checked)}
      >
        <div className={styles.circle} />
      </div>
    </label>
  );
}
