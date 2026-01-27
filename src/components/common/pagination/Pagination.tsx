// src/components/common/pagination/Pagination.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/

import styles from "./Pagination.module.css";

import Image from "next/image";
import ChevronLeftIcon from "@/assets/chevron_left.svg";
import ChevronRightIcon from "@/assets/chevron_right.svg";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hideIfSinglePage?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hideIfSinglePage = false,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // 왼쪽 화살표
    pageNumbers.push(
      <button
        key="prev"
        className={styles.paginationButton}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Image src={ChevronLeftIcon} alt="이전" width={20} height={20} />
      </button>
    );

    // 페이지 번호
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`${styles.paginationButton} ${
            currentPage === i ? styles.active : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </button>
      );
    }

    // 오른쪽 화살표
    pageNumbers.push(
      <button
        key="next"
        className={styles.paginationButton}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Image src={ChevronRightIcon} alt="다음" width={20} height={20} />
      </button>
    );

    return pageNumbers;
  };

  if (hideIfSinglePage && totalPages <= 1) return null;

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationWrapper}>{renderPageNumbers()}</div>
    </div>
  );
}
