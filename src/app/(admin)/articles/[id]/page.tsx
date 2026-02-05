// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import React, {useEffect, useState} from "react";
import styles from "../article.module.scss"
import {useParams, useRouter} from "next/navigation";

import {CheckboxGroup} from "@/components/common/checkbox/CheckboxGroup";
import {deleteArticle, getArticleDetail} from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";
import {ArticleDetailModel} from "@/types/article.type";
import StatusBadge from "@/components/common/badge/StatusBadge";
import Swal from "sweetalert2";



export default function ArticleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const [detailData, setDetailData] = useState<ArticleDetailModel>();


    const initData = async () => {
        try {
            showLoading();
            const result = await getArticleDetail({id: params.id});
            setDetailData(result.data);
        } catch (error) {
        } finally {
            hideLoading();
        }
    };

    const moveUpdate = async () => {
        router.push(`/articles/${params.id}/update`);
    }

    const showDelete = async () => {
        const result = await Swal.fire({
            title: '아티클을 삭제하시겠어요?',
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
            const response = await deleteArticle(id);
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
                    아티클 상세
                </div>
                <StatusBadge status={detailData?.status ?? 'PUBLISHED'}></StatusBadge>
                <div className="box-flex ml-auto gap8">
                    <button className="btnBorder delete w90" onClick={()=>showDelete()}>삭제</button>
                    <button className="btnDefault w90" onClick={()=>moveUpdate()}>수정하기</button>
                </div>
            </div>

            <div className="container-default mb20 pa24">
                <div className={styles.titleCard}>
                    기본 정보
                </div>
                <div className={`${styles.textRequired} ${styles.noneRequired}`}>제목</div>
                <div className={`${styles.boxDetail} mb20`}>
                    {detailData ? detailData.title : '-'}
                </div>

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>요약</div>
                <div className={`${styles.boxDetail} mb20`}>
                    {detailData ? detailData.summary : '-'}
                </div>

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>출처</div>
                <div className={`${styles.boxDetail} mb20`}>
                    {detailData ? detailData.source : '-'}
                </div>

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>직군</div>
                <CheckboxGroup options={[
                    { label: "기획자", value: "기획자" },
                    { label: "디자이너", value: "디자이너" },
                    { label: "개발자", value: "개발자" },
                    { label: "AI", value: "AI 개발자" },
                ]} value={detailData? detailData?.targetRoles:[]}
                className="mb30"
                ></CheckboxGroup>

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>등록일</div>
                <div className={`${styles.boxDetail}`}>
                    {detailData ? detailData.createdAt : '-'}
                </div>
            </div>

            <div className="container-default mb20 pa24">
                <div className={styles.titleCard}>
                    자동 수집 정보
                </div>

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>원문 링크 Link URL</div>
                <div className={`${styles.boxDetail}`}>
                    {detailData ? detailData.originalUrl : '-'}
                </div>
            </div>

            <div className="container-default mb20 pa24">
                <div className={styles.titleCard}>
                    클릭 수
                </div>

                <div className="fs18 fw600">
                {detailData ? detailData.clickCount : '0'}
                </div>
            </div>

            <div className="container-default mb20 pa24">
                <div className={styles.titleCard}>
                    썸네일 미리보기
                </div>

                <div className={`${styles.boxDetail}`}>
                    {detailData ? detailData.thumbnailUrl : '-'}
                </div>
            </div>

        </>
    );
}
