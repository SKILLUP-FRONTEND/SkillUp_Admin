// src/components/common/toggle/ToggleSwitch.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/

import styles from "./ToggleSwitch.module.css";

interface ToggleProps {
    active: boolean;
    label: string;
    onToggleChange: (active: boolean) => void;
}


export default function ToggleSwitch({label, active, onToggleChange}: ToggleProps) {
    const onChange = (checked: boolean) => {
        onToggleChange(checked);
    };

    return (
        <label className={styles.toggleWrapper}>
            <span className={styles.labelText}>{label}</span>
            <div
                className={`${styles.toggle} ${active ? styles.active : ""}`}
                onClick={() => onChange(!active)}
            >
                <div className={styles.circle}/>
            </div>
        </label>
    );
}
