// src/components/common/chart/DonutChart.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-02
  최종 수정일 : 2025-09-02
*/

import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#8D67FF", "#FC709B", "#9CC8FF"];

const renderCustomizedLabel = (props: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
  } = props;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

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
        nameKey="name"
        label={renderCustomizedLabel}
        labelLine={false}
      >
        {data.map((_, idx) => (
          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
        ))}
      </Pie>

      <Tooltip />
      <Legend verticalAlign="middle" align="right" layout="vertical" />
    </PieChart>
  );
}
