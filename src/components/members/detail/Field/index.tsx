// src/components/members/detail/Field/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-02
  최종 수정일 : 2025-09-02
*/

import styles from "./style.module.css";

interface FieldProps {
  label: string;
  value: string;
}

export default function Field({ label, value }: FieldProps) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.fieldValue}>
        <span className={styles.fieldValueText}>{value}</span>
      </div>
    </div>
  );
}
