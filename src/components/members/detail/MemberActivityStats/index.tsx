// src/components/members/detail/MemberActivityStats/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-02
  최종 수정일 : 2025-09-02
*/

import styles from "./style.module.css";
import UpdateIcon from "@/assets/update.svg";
import Image from "next/image";
import ChevronDownIcon from "@/assets/chevron_down.svg";
import BarChartComponent from "@/components/common/chart/BarChart";
import DonutChart from "@/components/common/chart/DonutChart";
import { DONUT_CHART_DATA, BAR_CHART_DATA } from "@/mocks/members.mock";

const memberActivityStatsHeaderLeftContent = [
  {
    title: "조회한 행사 수",
    value: "125",
  },

  {
    title: "저장한 행사 수",
    value: "25",
  },

  {
    title: "신청한 행사 수",
    value: "5",
  },
];

export default function MemberActivityStats() {
  return (
    <div className={styles.memberActivityStats}>
      <div className={styles.memberActivityStatsHeader}>
        <div className={styles.memberActivityStatsHeaderLeft}>
          <h3 className={styles.memberActivityStatsHeaderLeftTitle}>
            활동 내역
          </h3>
          <div className={styles.memberActivityStatsHeaderLeftContent}>
            {memberActivityStatsHeaderLeftContent.map((item) => (
              <div
                className={styles.memberActivityStatsHeaderLeftContentItem}
                key={item.title}
              >
                <h4>{item.value}</h4>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.memberActivityStatsHeaderRight}>
          <span className={styles.memberActivityStatsHeaderRightText}>
            MM/DD HH:MM
          </span>
          <Image src={UpdateIcon} alt="update" width={14} height={14} />
        </div>
      </div>
      <div className={styles.memberActivityStatsBody}>
        {/* TODO : 추후 드롭다운 추가 */}
        <div className={styles.memberActivityStatsBodyItem}>
          <span>카테고리별 조회한 행사</span>
          <Image
            src={ChevronDownIcon}
            alt="chevron down"
            width={13}
            height={8}
          />
        </div>
        {/* TODO : 추후 차트 데이터 구체화되면 추가 필요*/}
        <div className={styles.memberActivityStatsBodyChart}>
          <DonutChart data={DONUT_CHART_DATA} />
          <BarChartComponent data={BAR_CHART_DATA} />
        </div>
      </div>
    </div>
  );
}
