// src/app/(admin)/members/page.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/

"use client";

import styles from "./members.module.css";
import ToggleSwitch from "@/components/common/toggle/ToggleSwitch";
import CategoryFilterTabs from "@/components/common/filter/CategoryFilterTabs";
import {Member} from "@/types/member.type";
import StatusBadge from "@/components/common/badge/StatusBadge";
import {useCallback, useEffect, useState} from "react";
import SearchInput from "@/components/common/input/SearchInput";
import {MEMBERS} from "@/mocks/members.mock";
import {DataTable} from "@/components/common/table/DataTable";
import {useRouter, useSearchParams} from "next/navigation";
import Pagination from "@/components/common/pagination/Pagination";
import {getAllMembers} from "@/api/instance";
import {useLoadingStore} from "@/store/loadingStore";
import {DataTableColumn} from "@/components/common/table/DataTableColumn";

export default function Members() {
    const [data,setData] = useState(MEMBERS);

    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const [categories, setCategories] = useState([
        {label: "전체", count: 0, value: "all"},
        {label: "기획", count: 0, value: "plan"},
        {label: "디자인", count: 0, value: "design"},
        {label: "개발", count: 0, value: "dev"},
    ]);
    const searchParams = useSearchParams();

    const page = Number(searchParams.get('page') ?? 1);
    const deleted = searchParams.get('deleted') === 'true';
    const keyword = searchParams.get('keyWard') ?? ''

    const [filterData, setFilterData] = useState({
        page: page,
        deleted: deleted,
        keyWard: keyword,
    });
    const [selected, setSelected] = useState("all");

    const onSelect = (key: string) => {
        setSelected(key);
    };

    const initData = async () => {
        try {
            showLoading();
            setRouterFilter();
            const result = await getAllMembers(filterData);
            console.log(result);
        } catch (error) {
            console.log(error);
        } finally {
            hideLoading();
        }
    };

    const setDeleteFilter = (value: boolean) => {
        setFilterData(prev => ({...prev, deleted: value}));
    };
    const setPageFilter = (value: number) => {
        setFilterData(prev => ({...prev, page: value}));
    };

    const setRouterFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(filterData).forEach(([key, value]) => {
            params.set(key, String(value));
        });
        router.replace(`?${params.toString()}`);
    };
    useEffect(() => {
        initData().then();
    }, [filterData]);


    return (
        <>
            <div className="box-flex mb32">
                <div className="title-page mr-auto">회원관리</div>
                <ToggleSwitch
                    label="탈퇴 회원 포함"
                    active={filterData.deleted}
                    onToggleChange={(isActive) => {
                        setDeleteFilter(isActive);
                    }}
                />
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
                <div className="title-table">
                    회원 {data.length}명
                </div>
                <DataTable data={data} onRowClick={(row) => console.log(row)}>
                    <DataTableColumn prop="id" label="No" width="84px" />
                    <DataTableColumn prop="name" label="이름" />
                    <DataTableColumn prop="email" label="이메일" />
                    <DataTableColumn prop="createdAt" label="가입일" />
                    <DataTableColumn prop="loginMethod" label="로그인 방법" />
                    <DataTableColumn prop="job" label="직군" ></DataTableColumn>
                    <DataTableColumn
                        prop="status"
                        label="상태"

                    >
                        {(row) => <StatusBadge status={row.status} />}

                    </DataTableColumn>
                </DataTable>
                <Pagination
                    currentPage={filterData.page}
                    totalPages={Math.ceil(data.length / 5)}
                    onPageChange={(page) => {
                        setPageFilter(page);
                    }}
                    hideIfSinglePage={false}
                />
            </div>
        </>
    );
}
