// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import React, {useEffect, useState} from "react";
import styles from "../banner.module.scss"
import {useParams, useRouter} from "next/navigation";

import {deleteBanner, getBannerDetail} from "@/api/client";
import Swal from "sweetalert2";
import {BannerDetailModel} from "@/types/banner.type";
import {useLoadingStore} from "@/store/loadingStore";


export default function BannerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const [detailData, setDetailData] = useState<BannerDetailModel>();
    const [preview, setPreview] = useState<string | null>(null);

    const initData = async () => {
        try {
            showLoading();
            const result = await getBannerDetail({id: params.id});
            setDetailData(result.data);
        } catch (error) {
            console.log(error);
        } finally {
            hideLoading();
        }
    };

    const moveUpdate = async () => {
        router.push(`/banners/${params.id}/update`);
    }

    const showDelete = async () => {
        const result = await Swal.fire({
            title: '배너를 삭제하시겠어요?',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#d33',
        });

        if (result.value) {
            onDelete(Number(params.id));

        }
    }

    const onDelete = async (id: number) => {
        showLoading();
        try {
            const response = await deleteBanner(id);
            if (response.code == "SUCCESS") {
                Swal.fire({
                    title: '삭제되었습니다.',
                    confirmButtonText: '확인',
                }).then();
                router.back();
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
    }, []);

    return (
        <>
            <div className="box-flex mb32 a-center">
                <div className="title-page mr12">
                    배너 상세
                </div>

                <div className="box-flex ml-auto gap8">
                    <button className="btnBorder delete w90" onClick={() => showDelete()}>삭제</button>
                    <button className="btnDefault w90" onClick={() => moveUpdate()}>수정하기</button>
                </div>
            </div>

            <div className="container-default mb20 pa24">
                <div className={`${styles.textRequired} ${styles.noneRequired}`}>서브 타이틀</div>
                <div className={`${styles.boxDetail} mb20`}>
                    {detailData ? detailData.subTitle : '-'}
                </div>

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>메인 타이틀</div>
                <div className={`${styles.boxDetail} mb20`}>
                    {detailData ? detailData.mainTitle : '-'}
                </div>

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>설명</div>
                <div className={`${styles.boxDetail} mb20`}>
                    {detailData ? detailData.description : '-'}
                </div>

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>대표 이미지</div>
                <div className={`${styles.boxDetail} mb20`}>
                    {detailData?.bannerImageUrl && (
                        <img src={detailData?.bannerImageUrl} alt="preview" style={{width: '100%'}}/>
                    )}
                </div>


                <div className={`${styles.textRequired} ${styles.noneRequired}`}>주소 링크</div>
                <div className={`${styles.boxDetail} mb20`}>
                    {detailData ? detailData.bannerLink : '-'}
                </div>

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>등록 기간</div>
                <div className={`${styles.boxDetail}`}>
                    {detailData ? `${detailData.startAt} ~ ${detailData.endAt}` : '-'}
                </div>


            </div>


        </>
    );
}
