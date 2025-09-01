// src/components/common/chart/DonutChart.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-02
  최종 수정일 : 2025-09-02
*/

import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#8D67FF", "#FC709B", "#9CC8FF"];

export default function DonutChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <PieChart width={280} height={240}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={2}
        dataKey="value"
      >
        {data.map((_, idx) => (
          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
        ))}
      </Pie>
      <Legend verticalAlign="middle" align="right" layout="vertical" />
    </PieChart>
  );
}
