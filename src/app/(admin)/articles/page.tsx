// src/app/(admin)/articles/page.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/

"use client";

import styles from "./article.module.scss";
import CategoryFilterTabs from "@/components/common/filter/CategoryFilterTabs";
import StatusBadge from "@/components/common/badge/StatusBadge";
import {useEffect, useState} from "react";
import SearchInput from "@/components/common/input/SearchInput";
import {DataTable} from "@/components/common/table/DataTable";
import {useRouter, useSearchParams} from "next/navigation";
import Pagination from "@/components/common/pagination/Pagination";
import {deleteArticle, getArticle} from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";
import {DataTableColumn} from "@/components/common/table/DataTableColumn";
import Dropdown from "@/components/common/dropdown/Dropdown";
import Image from "next/image";
import Swal from "sweetalert2";
import {ArticleModel} from "@/types/article.type";


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
        router.push('/articles/create');
    }

    const returnTotalCount = () => {
        switch (selected) {
            case "PUBLISHED":
                return categories.find(category => category.value === "PUBLISHED")?.count ?? 0;
            case "DRAFT":
                return categories.find(category => category.value === "DRAFT")?.count ?? 0;
            default:
                return 0;
        }
    }

    const returnIndex = (index?: number) => {

        return (returnTotalCount() ?? 0) - (page * 10) - (index ?? 0);

    }

    const moveDetail = (row: ArticleModel) => {
        router.push(`/articles/${row.id}`);
    }
    const moveUpdate = (row: ArticleModel) => {
        router.push(`/articles/${row.id}/update`);
    }

    const showDelete = async (row: ArticleModel) => {
        const result = await Swal.fire({
            title: '아티클을 삭제하시겠어요?',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#d33',
        });

        if (result.value) {
            await onDelete(row.id);
        }
    }

    const onDelete = async (id: number) => {
        showLoading();
        try {
            const response = await deleteArticle(id);
            if (response.code == "SUCCESS") {
                Swal.fire({
                    title: '삭제되었습니다.',
                    confirmButtonText: '확인',
                }).then();
                initData().then();
            } else {
                Swal.fire({
                    title: '삭제에 실패했습니다',
                    confirmButtonText: '확인',
                });
            }
        } catch (error) {
            Swal.fire({
                title: '삭제에 실패했습니다',
                confirmButtonText: '확인',
            });
        } finally {
            hideLoading();
        }
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
                <DataTable<ArticleModel> data={data} onRowClick={(row) => moveDetail(row)}>
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
                    <DataTableColumn prop="createdAt" label="등록일" width={175}>
                        {(row) => {
                            if (!row.createdAt)
                                return '-';

                            const date = new Date(row.createdAt);
                            const formatted = date.toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            });
                            return <div>{formatted}</div>;
                        }}

                    </DataTableColumn>
                    <DataTableColumn width={108}
                                     label="액션">
                        {(row: ArticleModel) => {
                            return <div className="box-flex gap8">
                                <button onClick={(e) => {
                                    e.stopPropagation()
                                    moveUpdate(row)
                                }}
                                        className={`${styles.btnOption} ${styles.edit}`}></button>
                                <button onClick={(e) => {
                                    e.stopPropagation()
                                    showDelete(row).then();
                                }}
                                        className={`${styles.btnOption} ${styles.delete}`}></button>
                            </div>
                        }}
                    </DataTableColumn>
                </DataTable>
                <Pagination
                    currentPage={filterData.page}
                    totalPages={Math.ceil(returnTotalCount() / 10)}
                    onPageChange={(page) => {
                        setPageFilter(page);
                    }}
                    hideIfSinglePage={false}
                />
            </div>
        </>
    );
}
