// src/components/members/MemberPagination/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-01
  최종 수정일 : 2025-09-01
*/

import Image from "next/image";
import ChevronLeftIcon from "@/assets/chevron_left.svg";
import ChevronRightIcon from "@/assets/chevron_right.svg";
import styles from "./style.module.css";

export default function MemberPagination() {
  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationWrapper}>
        <button className={styles.paginationButton}>
          <Image src={ChevronLeftIcon} alt="이전" width={20} height={20} />
        </button>
        <button className={`${styles.paginationButton} ${styles.active}`}>
          1
        </button>
        <button className={styles.paginationButton}>2</button>
        <button className={styles.paginationButton}>3</button>
        <button className={styles.paginationButton}>4</button>
        <button className={styles.paginationButton}>5</button>
        <button className={styles.paginationButton}>6</button>
        <button className={styles.paginationButton}>7</button>
        <button className={styles.paginationButton}>8</button>
        <button className={styles.paginationButton}>9</button>
        <button className={styles.paginationButton}>10</button>
        <button className={`${styles.paginationButton} ${styles.ellipsis}`}>
          ···
        </button>
        <button className={styles.paginationButton}>N</button>
        <button className={styles.paginationButton}>
          <Image src={ChevronRightIcon} alt="다음" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}
