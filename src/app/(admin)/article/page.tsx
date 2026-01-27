// src/app/(admin)/articles/page.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/

"use client";

import styles from "./article.module.css";
import ToggleSwitch from "@/components/common/toggle/ToggleSwitch";
import CategoryFilterTabs from "@/components/common/filter/CategoryFilterTabs";
import {Member} from "@/types/member.type";
import StatusBadge from "@/components/common/badge/StatusBadge";
import {useCallback, useEffect, useState} from "react";
import SearchInput from "@/components/common/input/SearchInput";
import {DataTable} from "@/components/common/table/DataTable";
import {useRouter, useSearchParams} from "next/navigation";
import Pagination from "@/components/common/pagination/Pagination";
import {getArticle} from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";
import {DataTableColumn} from "@/components/common/table/DataTableColumn";
import Dropdown from "@/components/common/dropdown/Dropdown";
import Image from "next/image";

export default function Article() {
    const [data, setData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("게시일순");

    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const [categories, setCategories] = useState([
        {label: "등록됨", count: 0, value: "PUBLISHED"},
        {label: "임시저장", count: 0, value: "DRAFT"},

    ]);
    const searchParams = useSearchParams();

    const page = Number(searchParams.get('page') ?? 0);
    const keyword = searchParams.get('keyword') ?? ''

    const [filterData, setFilterData] = useState({
        page: page,
        keyword: keyword,
    });
    const [selected, setSelected] = useState("PUBLISHED");

    const onSelect = (key: string) => {
        setPageFilter(0);
        setSelected(key);
    };

    const initData = async () => {
        try {
            showLoading();
            setRouterFilter();
            const filterParams = {
                ...filterData,
                status: selected
            };
            const result = await getArticle(filterParams);
            setCategories(prev =>
                prev.map(category => {
                    if (category.value === "PUBLISHED") {
                        return {...category, count: result.data.publishedTotal};
                    }
                    if (category.value === "DRAFT") {
                        return {...category, count: result.data.draftTotal};
                    }
                    return category;
                })
            );
            setData(result.data.articles);
        } catch (error) {
            console.log(error);
        } finally {
            hideLoading();
        }
    };


    const setPageFilter = (value: number) => {
        setFilterData(prev => ({...prev, page: value}));
    };

    const setKeywordFilter = (value: string) => {
        setFilterData(prev => ({...prev, keyword: value}));
    };


    const setRouterFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(filterData).forEach(([key, value]) => {
            params.set(key, String(value));
        });
        router.replace(`?${params.toString()}`);
    };

    const moveCreate = () => {
        router.push('/article/create');
    }

    const returnTotalCount = () => {
        switch (selected) {
            case "PUBLISHED":
                return categories.find(category => category.value === "PUBLISHED")?.count;
            case "DRAFT":
                return categories.find(category => category.value === "DRAFT")?.count;
            default:
                return 0;
        }
    }

    const returnIndex= (index?:number)=>{

        return (returnTotalCount() ?? 0) - (page * 10) - (index ?? 0);

    }

    useEffect(() => {
        initData().then();
    }, [filterData, selected]);


    return (
        <>
            <div className="box-flex mb32">
                <div className="title-page mr-auto">아티클 관리</div>
                <button className="btnDefault" onClick={moveCreate}>+ 신규 등록</button>
            </div>

            <div className="box-flex mb12">
                <CategoryFilterTabs
                    categories={categories}
                    selected={selected}
                    onSelect={onSelect}
                    className="mr-auto"
                />
                <SearchInput
                    onSearch={(keyword) => {
                        setKeywordFilter(keyword);
                    }}
                />
            </div>
            <div className="container-default">

                <div className="box-flex a-center">
                    <div className="title-table mr-auto">
                        등록된 아티클 {returnTotalCount()}개
                    </div>

                    <Dropdown
                        options={[
                            {label: "게시일 순", value: "게시일순"},
                            {label: "등록일 순", value: "등록일순"},
                        ]}
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        placeholder="상태 선택"
                    />
                </div>
                <DataTable data={data} onRowClick={(row) => console.log(row)}>
                    <DataTableColumn label="No" width={84}>
                        {(row, index) => {
                            return returnIndex(index);
                        }}
                    </DataTableColumn>
                    <DataTableColumn prop="thumbnailUrl" label="썸네일">
                        {(row) =>
                            row.thumbnailUrl ? (
                                <Image
                                    src={row.thumbnailUrl}
                                    alt="thumbnail"
                                    width={96}
                                    height={55}
                                />
                            ) : (
                                <span>-</span>
                            )
                        }
                    </DataTableColumn>
                    <DataTableColumn prop="title" label="제목"/>
                    <DataTableColumn prop="source" label="출처"/>
                    <DataTableColumn prop="originalPublishedDate" label="원문 게시일" width={120}/>
                    <DataTableColumn prop="targetRoles" label="직군" width={100}>

                        {(row) =>
                            <div>
                                {row.targetRoles.map((targetRole: string) => (

                                    <div key={targetRole}>
                                        {targetRole}
                                    </div>
                                ))}
                            </div>
                        }

                    </DataTableColumn>
                    <DataTableColumn prop="status" label="상태" width={88}>
                        {(row) => <StatusBadge status={row.status}></StatusBadge>}
                    </DataTableColumn>
                    <DataTableColumn prop="createdAt" label="등록일" width={175}/>
                    <DataTableColumn width={108}
                                     label="액션">

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
