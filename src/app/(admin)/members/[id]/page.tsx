// src/app/(admin)/members/[id]/page.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-02
  최종 수정일 : 2025-09-02
*/

"use client";

import dayjs from 'dayjs';
import styles from "../member.module.scss";

import MemberActivityStats from "@/components/members/detail/MemberActivityStats";
import React, {useEffect, useState} from "react";
import {getArticleDetail, getMemberCount, getMemberDetail, getMemberInfo} from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";

import {MemberDetailModel} from "@/types/member.type";
import {useParams} from "next/navigation";
import Image from "next/image";
import UpdateIcon from "@/assets/update.svg";
import Dropdown from "@/components/common/dropdown/Dropdown";
import DonutChart from "@/components/common/chart/DonutChart";
import BarChartComponent from "@/components/common/chart/BarChart";

export default function MemberDetail() {
    const params = useParams();

    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const [detailData, setDetailData] = useState<MemberDetailModel>();
    const [barChartData, setBarChartData] = useState<[]>();
    const [donutChartData, setDonutChartData] = useState<unknown[]>();
    const [initialTime, setInitialTime] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState("VIEW");

    const initData = async () => {
        try {
            showLoading();
            const response = await getMemberDetail({id: params.id});
            setDetailData(response.data);

            await resetInfo();

        } catch (error) {
            console.log(error)
        } finally {
            hideLoading();
        }
    };

    const resetInfo = async () => {
        const formatted = dayjs().format('MM/DD HH:mm');
        setInitialTime(formatted);
        await initMemberInfo();
        await initMemberCount();
    }

    const initMemberInfo = async () => {
        try {
            const response = await getMemberInfo({id: params.id, category: selectedCategory });

            // "eventActionMonthlyCountResponses": [
            //     {
            //         "userMonthlyCount": 0,
            //         "othersMonthlyCount": 0,
            //         "monthLabels": "string"
            //     }
            // ],
            //     "rolePercentageResponses": [
            //     {
            //         "role": "string",
            //         "percentage": 0
            //     }
            // ]

            setBarChartData(response.data.eventActionMonthlyCountResponses);
            setDonutChartData([{role:'기획',percentage:10},{role:'디자인',percentage:90},{role:'개발',percentage:90}])
            // setDonutChartData(response.data.rolePercentageResponses)
        } catch (e) {

        }


    }

    const initMemberCount = async () => {
        try {
            const response = await getMemberCount({id: params.id});
            console.log(response)
        } catch (e) {

        }


    }

    useEffect(() => {
        initData().then();
    }, [ ]);

    useEffect(() => {
        initMemberInfo().then();
    }, [selectedCategory]);

    return (
        <>
            <div className="title-page mb34">
                회원 상세
            </div>
            <div className="box-flex gap12 a-start">
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

                <div className="fg1 container-default pa20">
                    <div className="box-flex mb32 a-center">

                        <div className="fs24 mr-auto">
                            활동 내역
                        </div>
                        <div className="fs12 fc7a">
                            {initialTime ? initialTime : '-'}
                        </div>
                        <button onClick={resetInfo} className="btn-icon" type="button">
                        </button>
                    </div>
                    <div className="box-flex mb36"
                    >
                        <div className="fg1">
                            <div className="fs28 fw700">
                                125
                            </div>
                            <div>
                                조회한 행사 수
                            </div>
                        </div>

                        <div className="fg1">
                            <div className="fs28 fw700">
                                125
                            </div>
                            <div>
                                저장한 행사 수
                            </div>
                        </div>

                        <div className="fg1">
                            <div className="fs28 fw700">
                                125
                            </div>
                            <div>
                                신청한 행사 수
                            </div>
                        </div>

                    </div>

                    <div className="box-flex">
                        <Dropdown
                            options={[
                                {label: "카테고리별 조회한 행사", value: "VIEW"},
                                {label: "카테고리별 저장한 행사", value: "SAVE"},
                                {label: "카테고리별 신청한 행사", value: "APPLY"},
                            ]}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                        />
                    </div>

                    <div className="box-flex a-center">
                        <DonutChart
                            data={donutChartData ? donutChartData : []}
                            dataKey="percentage"
                            valueKey="role"
                        />
                        <BarChartComponent
                            data={barChartData ? barChartData : []}
                            dataKey="monthLabels"
                            valueKey="userMonthlyCount"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
