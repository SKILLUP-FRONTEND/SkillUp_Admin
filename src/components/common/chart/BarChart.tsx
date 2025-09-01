// src/components/common/chart/BarChart.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-02
  최종 수정일 : 2025-09-02
*/

import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function BarChartComponent({
  data,
}: {
  data: { month: string; value: number }[];
}) {
  return (
    <BarChart width={300} height={180} data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#8D67FF" radius={[4, 4, 0, 0]} />
    </BarChart>
  );
}
