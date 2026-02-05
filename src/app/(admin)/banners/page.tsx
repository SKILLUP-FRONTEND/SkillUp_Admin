// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import {DataTable} from "@/components/common/table/DataTable";
import {DataTableColumn} from "@/components/common/table/DataTableColumn";

import {useEffect, useState} from "react";
import {getBanner, updateBannerOrder} from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";
import {useRouter, useSearchParams} from "next/navigation";
import Pagination from "@/components/common/pagination/Pagination";
import {BannerModel} from "@/types/banner.type";


export default function Banners() {
    const router = useRouter();
    const [currentBanner, setCurrentBanner] = useState<BannerModel[]>([]);
    const [prevBanner, setPrevBanner] = useState<BannerModel[]>([]);
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page') ?? 0);

    const [filterData, setFilterData] = useState({
        page: page,
    });

    const setRouterFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(filterData).forEach(([key, value]) => {
            params.set(key, String(value));
        });
        router.replace(`?${params.toString()}`);
    };

    const setPageFilter = (value: number) => {
        setFilterData(prev => ({...prev, page: value}));
    };

    const initData = async () => {
        try {
            showLoading();

            setRouterFilter();
            const filterParams = {
                ...filterData,
            };

            const result = await getBanner(filterParams);

            setCurrentBanner(result.data.eventActiveBannerList);
            setPrevBanner(result.data.eventPastBannerList);

        } catch (error) {
        } finally {
            hideLoading();
        }
    };



    const moveDetail = (row:BannerModel) => {
        router.push(`/banners/${row.id}`);
    }

    const moveCreate = () => {
        router.push(`/banners/create`);
    }

    const handleOrderChange = (newData: BannerModel[]) => {
        setCurrentBanner(newData);
        updateOrder(newData).then();
    };

    const updateOrder = async (newData: BannerModel[]) => {
        try {
            showLoading();
            setRouterFilter();
            const params = {
                bannerIds: newData.map((e) => {
                    return e.id
                }),
            };
            await updateBannerOrder(params);


        } catch (error) {
        } finally {
            hideLoading();
        }
    }

    useEffect(() => {
        initData().then();
    }, [filterData]);
    return (
        <>
            <div className="box-flex mb32">
                <div className="title-page mr-auto">배너 관리</div>
                <button className="btnDefault" onClick={() => moveCreate()}>+ 신규 등록</button>

            </div>
            <div className="container-default mb60">
                <DataTable<BannerModel> data={currentBanner}
                                        draggable
                                        onOrderChange={handleOrderChange}
                >
                    <DataTableColumn label="" width={84}>
                        {(row, index, drag) => (
                            <div
                                draggable
                                onDragStart={drag!.startDrag}
                                style={{cursor: "grab", fontSize: 18}}
                            >
                                ☰
                            </div>
                        )}
                    </DataTableColumn>
                    <DataTableColumn label="순서" width={84}>
                        {(row: BannerModel,index) => (
                            <div>
                                {(index??0)+1}
                            </div>
                        )}
                    </DataTableColumn>
                    <DataTableColumn prop="mainTitle" label="제목"/>
                    <DataTableColumn label="업로드일">
                        {(row: BannerModel) => (
                            <div

                            >
                                {row.startAt} ~ {row.endAt}
                            </div>
                        )}
                    </DataTableColumn>
                    <DataTableColumn
                        prop="clickCount"
                        label="클릭수"
                    />
                    <DataTableColumn
                        width={100}
                        label="상세"
                    >
                        {(row: BannerModel) => (
                            <button className="btnOption" onClick={()=>moveDetail(row)}>상세</button>
                        )}

                    </DataTableColumn>
                </DataTable>
            </div>
            <div className="title-page mb24">이전 배너</div>


            <div className="container-default mb60 ">
                <DataTable data={prevBanner}>
                    <DataTableColumn label="순서" width={84}>

                    </DataTableColumn>
                    <DataTableColumn prop="mainTitle" label="제목"/>
                    <DataTableColumn label="업로드일">
                        {(row: BannerModel) => (
                            <div

                            >
                                {row.startAt} ~ {row.endAt}
                            </div>
                        )}
                    </DataTableColumn>
                    <DataTableColumn
                        prop="clickCount"
                        label="클릭수"
                    />
                    <DataTableColumn
                        width={100}
                        label="상세"
                    >
                        {(row: BannerModel) => (
                            <button className="btnOption" onClick={()=>moveDetail(row)}>상세</button>
                        )}

                    </DataTableColumn>
                </DataTable>
            </div>

            <Pagination
                currentPage={filterData.page}
                totalPages={Math.ceil(prevBanner.length / 5)}
                onPageChange={(page) => {
                    setPageFilter(page);
                }}
                hideIfSinglePage={false}
            />

        </>
    );
}
