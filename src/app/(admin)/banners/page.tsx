// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import {DataTable} from "@/components/common/table/DataTable";
import {DataTableColumn} from "@/components/common/table/DataTableColumn";

import StatusBadge from "@/components/common/badge/StatusBadge";
import {useEffect, useState} from "react";
import {getArticle, getBanner} from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";
import {useRouter, useSearchParams} from "next/navigation";
import Pagination from "@/components/common/pagination/Pagination";
import {BannerModel} from "@/types/banner.type";



export default function Banners() {
    const router = useRouter();
    const [currentBanner,setCurrentBanner] = useState([]);
    const [prevBanner,setPrevBanner] = useState([]);
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page') ?? 1);

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
            console.log(error);
        } finally {
            hideLoading();
        }
    };

    const moveCreate = ()=>{
        router.push(`/banners/create`);
    }
    useEffect(() => {
        initData().then();
    }, [filterData]);
    return (
        <>
            <div className="box-flex mb32">
                <div className="title-page mr-auto">배너 관리</div>
                <button className="btnDefault" onClick={()=>moveCreate()}>+ 신규 등록</button>

            </div>
            {/*"displayOrder": 0,*/}
            {/*"title": "string",*/}
            {/*"bannerImageUrl": "string",*/}
            {/*"bannerLink": "string",*/}
            {/*"bannerType": "string",*/}
            {/*"startAt": "2026-01-30",*/}
            {/*"endAt": "2026-01-30"*/}
            <div className="container-default mb60">
                <DataTable<BannerModel> data={currentBanner} >

                    <DataTableColumn prop="displayOrder" label="순서"  width={84}>

                    </DataTableColumn>
                    <DataTableColumn prop="title" label="제목" />
                    <DataTableColumn prop="startAt" label="업로드일" />
                    <DataTableColumn
                        prop="status"
                        label="클릭수"
                    />
                    <DataTableColumn
                        prop="status"
                        label="상세"
                    />
                </DataTable>
            </div>
            <div className="title-page mb24">이전 배너</div>


            <div className="container-default mb60 ">
                <DataTable data={prevBanner} >
                    <DataTableColumn label="순서" width={84}>

                    </DataTableColumn>
                    <DataTableColumn prop="name" label="제목" />
                    <DataTableColumn prop="email" label="업로드일" />
                    <DataTableColumn
                        prop="status"
                        label="클릭수"
                    />
                    <DataTableColumn
                        prop="status"
                        label="상세"
                    />
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
