// src/components/common/chart/DonutChart.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-02
  최종 수정일 : 2025-09-02
*/

import {PieChart, Pie, Cell, Legend, Tooltip} from "recharts";

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

const EMPTY_DATA = [{ value: 1, name: '데이터 없음' }];
const EMPTY_COLOR = ['#e0e0e0']; // 빈 차트용 회색

export default function DonutChart({
                                       data,
                                       dataKey, // 숫자가 들어있는 키 (값)
                                       valueKey, // 이름이 들어있는 키 (항목명)
                                   }: {
    data: unknown[];
    dataKey: string;
    valueKey: string;
}) {
    const isEmpty = !data || data.length === 0;
    const chartData = isEmpty ? EMPTY_DATA : data;
    const finalDataKey = isEmpty ? "value" : dataKey;
    const finalNameKey = isEmpty ? "name" : valueKey;

    return (
        <PieChart width={240} height={240}>
            <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={isEmpty ? 0 : 2} // 데이터 없을 땐 간격 제거
                dataKey={finalDataKey}
                nameKey={finalNameKey}
                label={isEmpty ? false : renderCustomizedLabel} // 데이터 없을 땐 라벨 숨김
                labelLine={false}
                isAnimationActive={!isEmpty} // 빈 차트는 애니메이션 끄기
            >
                {isEmpty ? (
                    <Cell fill={EMPTY_COLOR[0]} />
                ) : (
                    data.map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]}/>
                    ))
                )}
            </Pie>

            {/* 데이터가 없을 때는 툴팁과 범례를 숨기거나 비활성화 */}
            {!isEmpty && <Tooltip />}
            {!isEmpty && <Legend verticalAlign="middle" align="right" layout="vertical"/>}

            {/* 데이터가 없을 때 중앙에 텍스트를 넣고 싶다면 아래처럼 추가 가능 */}
            {isEmpty && (
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#999" fontSize="14">
                    데이터 없음
                </text>
            )}
        </PieChart>
    );
}