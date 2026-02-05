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
import {useEffect, useState} from "react";
import SearchInput from "@/components/common/input/SearchInput";
import {DataTable} from "@/components/common/table/DataTable";

import Pagination from "@/components/common/pagination/Pagination";
import StatusBadge from "@/components/common/badge/StatusBadge";
import {EventModel} from "@/types/event.type";
import Dropdown from "@/components/common/dropdown/Dropdown";
import {useRouter, useSearchParams} from "next/navigation";
import {DataTableColumn} from "@/components/common/table/DataTableColumn";
import {getBanner, getEvents} from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";


export default function Events() {
    const router = useRouter();
    const [data, setData] = useState([]);

    const [categories, setCategories] = useState([
        {label: "전체", count: 0, value: "ALL"},
        {label: "컨퍼런스/세미나", count: 0, value: "CONFERENCE_SEMINAR"},
        {label: "공모전/해커톤", count: 0, value: "COMPETITION_HACKATHON"},
        {label: "부트캠프/동아리", count: 0, value: "BOOTCAMP_CLUB"},
        {label: "네트워킹/멘토링", count: 0, value: "NETWORKING_MENTORING"},
    ]);


    const [summary, setSummary] = useState({
            creatableCount: 0,
            ongoingCount: 0,
            recruitingClosedCount: 0,
            recruitingCount: 0,
            recruitingScheduledCount: 0,
            totalRegisteredCount: 0,
        }
    );


    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const onSelect = (value: string) => {
        setFilterData(prev => ({...prev, category: value, page: 0}));
    };

    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page') ?? 0);
    const deleted = searchParams.get('includeEnded') === 'true';
    const keyword = searchParams.get('keyword') ?? ''
    const category = searchParams.get('category') ?? 'ALL'
    const sort = searchParams.get('sort') ?? 'CREATED_AT'

    const [filterData, setFilterData] = useState({
        page: page,
        includeEnded: deleted,
        keyword: keyword,
        category: category,
        sort: sort
    });

    const setDeleteFilter = (value: boolean) => {
        setFilterData(prev => ({...prev, includeEnded: value}));
    };
    const setKeywordFilter = (value: string) => {
        setFilterData(prev => ({...prev, keyword: value}));
    };
    const setPageFilter = (value: number) => {
        setFilterData(prev => ({...prev, page: value}));
    };

    const setSortFilter = (value: string) => {
        setFilterData(prev => ({...prev, sort: value}));
    };

    const setRouterFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(filterData).forEach(([key, value]) => {
            params.set(key, String(value));
        });
        router.replace(`?${params.toString()}`);
    };

    const moveDetail = (row: EventModel) => {
        router.push(`/events/${row.id}`);
    }


    const initData = async () => {
        try {
            showLoading();

            setRouterFilter();
            const filterParams = {
                ...filterData,
            };


            const result = await getEvents(filterParams);


            console.log(result.data.categoryCounts);
            console.log(result.data.summary);

            setData(result.data.events);
            setCategories(prev =>
                prev.map(category => {
                    if (category.value === "ALL") {
                        const matchItem = result.data.categoryCounts.find((item: {
                            category: string,
                            count: number
                        }) => {
                            return item.category == '전체';
                        });
                        return {...category, count: matchItem?.count ?? 0};
                    }
                    if (category.value === "CONFERENCE_SEMINAR") {
                        const matchItem = result.data.categoryCounts.find((item: {
                            category: string,
                            count: number
                        }) => {
                            return item.category == '컨퍼런스/세미나';
                        });
                        return {...category, count: matchItem?.count ?? 0};
                    }
                    if (category.value === "COMPETITION_HACKATHON") {
                        const matchItem = result.data.categoryCounts.find((item: {
                            category: string,
                            count: number
                        }) => {
                            return item.category == '공모전/해커톤';
                        });
                        return {...category, count: matchItem?.count ?? 0};
                    }
                    if (category.value === "BOOTCAMP_CLUB") {
                        const matchItem = result.data.categoryCounts.find((item: {
                            category: string,
                            count: number
                        }) => {
                            return item.category == '부트캠프/동아리';
                        });
                        return {...category, count: matchItem?.count ?? 0};
                    }
                    if (category.value === "NETWORKING_MENTORING") {
                        const matchItem = result.data.categoryCounts.find((item: {
                            category: string,
                            count: number
                        }) => {
                            return item.category == '네트워킹/멘토링';
                        });
                        return {...category, count: matchItem?.count ?? 0};
                    }
                    return category;
                })
            );
            setSummary(result.data.summary);


        } catch (error) {
            console.log(error);
        } finally {
            hideLoading();
        }
    };
    const returnIndex = (index?: number) => {
        return (returnTotalCount() ?? 0) - (page * 10) - (index ?? 0);
    }

    const returnTotalCount = () => {
        switch (filterData.category) {
            case "ALL":
                return categories.find(category => category.value === "ALL")?.count ?? 0;
            case "CONFERENCE_SEMINAR":
                return categories.find(category => category.value === "CONFERENCE_SEMINAR")?.count ?? 0;
            case "COMPETITION_HACKATHON":
                return categories.find(category => category.value === "COMPETITION_HACKATHON")?.count ?? 0;
            case "BOOTCAMP_CLUB":
                return categories.find(category => category.value === "BOOTCAMP_CLUB")?.count ?? 0;
            case "NETWORKING_MENTORING":
                return categories.find(category => category.value === "NETWORKING_MENTORING")?.count ?? 0;
            default:
                return 0;
        }
    }

    const returnStatus = (data: string) => {
        switch (data) {
            case "종료":
                return "ENDED";
            case "모집중":
                return "RECRUITING";
            case "모집마감":
                return "RECRUITING_CLOSED";
            case "모집예정":
                return "RECRUITING_EXPECTED";
            default:
                return "ENDED";
        }
    }
    const moveCreate = () => {
        router.push('/events/create');
    }


    useEffect(() => {
        initData().then();
    }, [filterData]);

    return (
        <>
            <div className="box-flex mb32">
                <h1 className="title-page mr-auto">행사관리</h1>
                <button className="btnDefault" onClick={moveCreate}>등록하기</button>
            </div>
            <div className="mb20">
                <ToggleSwitch
                    label="종료된 행사 포함"
                    active={filterData.includeEnded}
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
                        {summary.totalRegisteredCount}
                    </div>
                </div>
                <div className={`container-default ${styles.boxCard} fg1 box-flex gap20`}>
                    <div className="fg1">
                        <div className={styles.titleCard}>
                            모집예정 행사
                        </div>
                        <div className={styles.textCard}>
                            {summary.recruitingScheduledCount}
                        </div>
                    </div>
                    <div className="fg1">
                        <div className={styles.titleCard}>
                            모집중인 행사
                        </div>
                        <div className={styles.textCard}>
                            {summary.recruitingCount}
                        </div>
                    </div>
                    <div className="fg1">
                        <div className={styles.titleCard}>
                            모집마감 행사
                        </div>
                        <div className={styles.textCard}>
                            {summary.recruitingClosedCount}
                        </div>
                    </div>
                    <div className="fg1">
                        <div className={styles.titleCard}>
                            진행중인 행사
                        </div>
                        <div className={styles.textCard}>
                            {summary.ongoingCount}
                        </div>
                    </div>
                </div>

                <div className="w232 container-default pl20 pt28 pb28">
                    <div className="color-black32 fs14 mb6">
                        등록 가능한 행사 수
                    </div>
                    <div className="fs28 fw700 lh1">
                        {summary.creatableCount}
                    </div>
                </div>


            </div>
            <div className="box-flex mb12">
                <CategoryFilterTabs
                    categories={categories}
                    selected={filterData.category}
                    onSelect={onSelect}
                    className="mr-auto"
                />
                <SearchInput onSearch={(keyword) => {
                    setKeywordFilter(keyword);
                }}
                             initialValue={filterData.keyword}/>
            </div>
            <div className="container-default">
                <div className="box-flex a-center">
                    <div className="title-table mr-auto">
                        등록된 행사 {returnTotalCount()}명
                    </div>

                    <Dropdown
                        options={[
                            {label: "등록일 순", value: "CREATED_AT"},
                            {label: "행사 시작일 순", value: "EVENT_START"},
                            {label: "조회수 많은 순", value: "VIEWS"},
                            {label: "저장 많은 순", value: "BOOKMARKS"},
                        ]}
                        value={filterData.sort}
                        onChange={setSortFilter}
                        placeholder="상태 선택"
                        className="w140"
                    />
                </div>

                <DataTable<EventModel>
                    data={data}
                    onRowClick={(row) => {
                        moveDetail(row)
                    }}
                >

                    <DataTableColumn label="No" width={84}>
                        {(row, index) => {
                            return returnIndex(index);
                        }}
                    </DataTableColumn>
                    <DataTableColumn prop="title" label="행사명"/>
                    <DataTableColumn prop="category" label="카테고리"/>
                    <DataTableColumn prop="eventPeriodText" label="행사 기간"/>
                    <DataTableColumn prop="viewsCount" label="조회수"/>
                    <DataTableColumn prop="bookmarksCount" label="저장수"/>
                    <DataTableColumn prop="status" label="상태">
                        {(row) => <StatusBadge status={returnStatus(row.status)}/>}
                    </DataTableColumn>
                    <DataTableColumn prop="createdAt" label="등록일" width={175}>
                        {(row) => {
                            const date = new Date(row.createdAt);
                            const formatted = date.toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            });
                            return <div>{formatted}</div>;
                        }}

                    </DataTableColumn>
                </DataTable>
                <Pagination
                    currentPage={filterData.page}
                    totalPages={Math.ceil(returnTotalCount() / 20)}
                    onPageChange={(page) => {
                        setPageFilter(page);
                    }}
                    hideIfSinglePage={false}
                />
            </div>

        </>
    );
}
