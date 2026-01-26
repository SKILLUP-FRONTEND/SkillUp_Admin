// src/app/(admin)/events/page.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/
"use client";


import styles from "./events.module.scss";
import ToggleSwitch from "@/components/common/toggle/ToggleSwitch";
import CategoryFilterTabs from "@/components/common/filter/CategoryFilterTabs";
import {useState} from "react";
import SearchInput from "@/components/common/input/SearchInput";
import {DataTable} from "@/components/common/table/DataTable";

import {EVENTS} from "@/mocks/events.mock";
import Pagination from "@/components/common/pagination/Pagination";
import StatusBadge from "@/components/common/badge/StatusBadge";
import {Event} from "@/types/event.type";
import Dropdown from "@/components/common/dropdown/Dropdown";
import {useSearchParams} from "next/navigation";
import {DataTableColumn} from "@/components/common/table/DataTableColumn";


const categories = [
    {label: "전체", count: 150, value: "all"},
    {label: "컨퍼런스/세미나", count: 40, value: "conference"},
    {label: "공모전/해커톤", count: 32, value: "competition"},
    {label: "부트캠프/동아리", count: 78, value: "bootcamp"},
    {label: "네트워킹/멘토링", count: 78, value: "networking"},
];


export default function Events() {

    const [data, setData] = useState(EVENTS);

    const [selected, setSelected] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const onSelect = (value: string) => {
        setSelected(value);
    };

    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page') ?? 1);
    const deleted = searchParams.get('deleted') === 'true';
    const keyword = searchParams.get('keyWard') ?? ''

    const [filterData, setFilterData] = useState({
        page: page,
        deleted: deleted,
        keyWard: keyword,
    });

    const setDeleteFilter = (value: boolean) => {
        setFilterData(prev => ({...prev, deleted: value}));
    };

    return (
        <>
            <div className="box-flex mb32">
                <h1 className="title-page mr-auto">행사관리</h1>
                <button className="btnDefault">등록하기</button>
            </div>
            <div className="mb20">
                <ToggleSwitch
                    label="종료된 행사 포함"
                    active={filterData.deleted}
                    onToggleChange={(isActive) => {
                        setDeleteFilter(isActive);
                    }}
                />
            </div>
            <div className="box-flex gap12 mb30">
                <div className={`container-default ${styles.boxCard} w172`}>
                    <div className={styles.titleCard}>
                        등록된 행사
                    </div>
                    <div className={styles.textCard}>
                        200
                    </div>
                </div>
                <div className={`container-default ${styles.boxCard} fg1 box-flex gap20`}>
                    <div className="fg1">
                        <div className={styles.titleCard}>
                            모집예정 행사
                        </div>
                        <div className={styles.textCard}>
                            200
                        </div>
                    </div>
                    <div className="fg1">
                        <div className={styles.titleCard}>
                            모집중인 행사
                        </div>
                        <div className={styles.textCard}>
                            200
                        </div>
                    </div>
                    <div className="fg1">
                        <div className={styles.titleCard}>
                            모집마감 행사
                        </div>
                        <div className={styles.textCard}>
                            200
                        </div>
                    </div>
                    <div className="fg1">
                        <div className={styles.titleCard}>
                            진행중인 행사
                        </div>
                        <div className={styles.textCard}>
                            200
                        </div>
                    </div>
                </div>

                <div className="w232 container-default pl20 pt28 pb28">
                    <div className="color-black32 fs14 mb6">
                        등록 가능한 행사 수
                    </div>
                    <div className="fs28 fw700 lh1">
                        200
                    </div>
                </div>


            </div>
            <div className="box-flex mb12">
                <CategoryFilterTabs
                    categories={categories}
                    selected={selected}
                    onSelect={onSelect}
                    className="mr-auto"
                />
                <SearchInput/>
            </div>
            <div className="container-default">
                <div className="box-flex a-center">
                    <div className="title-table mr-auto">
                        등록된 행사 {data.length}명
                    </div>

                    <Dropdown
                        options={[
                            {label: "전체", value: "all"},
                            {label: "모임예정 행사", value: "RECRUITING_EXPECTED"},
                            {label: "모집중인 행사", value: "RECRUITING"},
                            {label: "모집마감 행사", value: "RECRUITING_CLOSED"},
                            {label: "진행중인 행사", value: "ENDED"},
                        ]}
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        placeholder="상태 선택"
                    />
                </div>

                <DataTable
                    data={data}>
                    <DataTableColumn prop="id" label="No" width="84px">
                    </DataTableColumn>
                    <DataTableColumn prop="title" label="행사명"/>
                    <DataTableColumn prop="category" label="카테고리"/>
                    <DataTableColumn prop="period" label="행사 기간"/>
                    <DataTableColumn prop="views" label="조회수"/>
                    <DataTableColumn prop="likes" label="저장수"/>
                    <DataTableColumn prop="status" label="상태">
                        {(row) => <StatusBadge status={row.status} />}
                    </DataTableColumn>
                    <DataTableColumn prop="createdAt" label="등록일"/>
                </DataTable>
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(data.length / 5)}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                    }}
                    hideIfSinglePage={false}
                />


            </div>

        </>
    );
}
