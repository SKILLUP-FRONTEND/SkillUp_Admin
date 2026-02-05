// src/app/(admin)/members/[id]/page.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-02
  최종 수정일 : 2025-09-02
*/

"use client";

import styles from "../member.module.scss";

import MemberActivityStats from "@/components/members/detail/MemberActivityStats";
import React, {useEffect, useState} from "react";
import {getArticleDetail, getMemberDetail} from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";

import {MemberDetailModel} from "@/types/member.type";
import {useParams} from "next/navigation";

export default function MemberDetail() {
    const params = useParams();

    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const [detailData, setDetailData] = useState<MemberDetailModel>();

    const initData = async () => {
        try {
            showLoading();
            const result = await getMemberDetail({id: params.id});
            setDetailData(result.data);
        } catch (error) {
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        initData().then();
    }, []);

    return (
        <>
            <div className="title-page mb34">
                회원 상세
            </div>
            <div className="box-flex gap12">
                <div className="container-default fs-0 w400 pa24">

                    <div className={styles.textStatus}>{detailData?.status}</div>
                    <div className={styles.titleName}>{detailData?.name}</div>

                    <div className={styles.labelData}>이메일</div>
                    <div className={styles.boxData}>{detailData?.email}</div>


                    <div className={styles.labelData}>직군</div>
                    <div className={styles.boxData}>{detailData?.role}</div>

                    <div className={styles.labelData}>가입일</div>
                    <div className={styles.boxData}>{detailData?.createdAt}</div>

                    <div className={styles.labelData}>로그인 경로</div>
                    <div className={styles.boxData}>{detailData?.socialLoginType}</div>


                    <div className={styles.labelData}>최근 접속 시간</div>
                    <div className={styles.boxData}>{detailData?.lastLoginAt}</div>
                </div>

                <div className="fg1">
                    <MemberActivityStats/>
                </div>
            </div>

        </>
    );
}
