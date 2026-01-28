// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import React, {useEffect, useState} from "react";
import styles from "../article.module.scss"
import {useParams} from "next/navigation";

import {ArticleFormType, articleSchema} from "@/validators/article";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CheckboxGroup} from "@/components/common/checkbox/CheckboxGroup";
import {createArticle, getArticle, getArticleDetail, login} from "@/client/client";
import {router} from "next/dist/client";
import {useLoadingStore} from "@/store/loadingStore";
import Swal from "sweetalert2";
import {ArticleDetailModel, ArticleModel} from "@/types/article.type";

interface Props {
    params: {
        id: string;
    };
}

export default function ArticleDetailPage() {
    const params = useParams();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const [detailData, setDetailData] = useState<ArticleDetailModel>();


    const initData = async () => {
        try {
            showLoading();
            const result = await getArticleDetail({id: params.id});
            setDetailData(result.data);
        } catch (error) {
            console.log(error);
        } finally {
            hideLoading();
        }
    };


    useEffect(() => {
        initData().then();
    }, []);

    return (
        <>
            <div className="box-flex mb32">
                <div className="title-page">
                    아티클 상세
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
