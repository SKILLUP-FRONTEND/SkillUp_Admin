// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import React, {useEffect, useState} from "react";
import styles from "../events.module.scss"
import {useParams, useRouter} from "next/navigation";

import {CheckboxGroup} from "@/components/common/checkbox/CheckboxGroup";
import {deleteEvent, getEventDetail} from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";
import StatusBadge from "@/components/common/badge/StatusBadge";
import Swal from "sweetalert2";
import {EventDetailModel} from "@/types/event.type";
import {RadioGroup} from "@/components/common/radio/RadioGroup";
import {RadioBtn} from "@/components/common/radio/RadioBtn";


export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const [detailData, setDetailData] = useState<EventDetailModel>();


    const initData = async () => {
        try {
            showLoading();
            const result = await getEventDetail({id: params.id});
            setDetailData(result.data);
        } catch (error) {
        } finally {
            hideLoading();
        }
    };

    const moveUpdate = async () => {
        router.push(`/events/${params.id}/update`);
    }

    const showDelete = async () => {
        const result = await Swal.fire({
            title: '이벤트를 삭제하시겠어요?',
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
            const response = await deleteEvent(id);
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
                    행사 상세
                </div>
                <StatusBadge status={detailData?.status ?? 'PUBLISHED'}></StatusBadge>
                <div className="box-flex ml-auto gap8">
                    <button className="btnBorder delete w90" onClick={() => showDelete()}>삭제</button>
                    <button className="btnDefault w90" onClick={() => moveUpdate()}>수정하기</button>
                </div>
            </div>

            <div className="container-default mb20 pa24">
                <div className={`${styles.textRequired} ${styles.noneRequired}`}>행사명</div>
                <div className={`${styles.boxDetail} mb20`}>
                    {detailData ? detailData.title : '-'}
                </div>

                <div className={styles.titleCard}>
                    대표 이미지
                </div>

                <div className={`${styles.boxDetail} mb20`}>
                    {detailData ? detailData.thumbnailUrl : '-'}
                </div>


                <div className={`${styles.textRequired} ${styles.noneRequired}`}>카테고리</div>

                <RadioGroup className='mb20'
                            value={detailData ? detailData.category : ''} options={[
                    {label: '컨퍼런스/세미나', value: 'CONFERENCE_SEMINAR'},
                    {label: '공모전/해커톤', value: 'COMPETITION_HACKATHON'},
                    {label: '부트캠프/동아리', value: 'BOOTCAMP_CLUB'},
                    {label: '네트워킹/멘토링', value: 'NETWORKING_MENTORING'},
                ]}
                />

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>행사 기간</div>
                <div className={`${styles.boxDetail} mb20 box-flex gap12`}>
                    <div>
                        {detailData?.eventStart
                            ? new Intl.DateTimeFormat('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            }).format(new Date(detailData.eventStart))
                            : '-'}
                    </div>
                    <div>~</div>

                    <div>
                        {detailData?.eventEnd
                            ? new Intl.DateTimeFormat('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            }).format(new Date(detailData.eventEnd))
                            : '-'}
                    </div>
                </div>

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>모집 기간</div>
                <div className={`${styles.boxDetail} mb20 box-flex gap12`}>
                    <div>
                        {detailData?.recruitStart
                            ? new Intl.DateTimeFormat('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            }).format(new Date(detailData.recruitStart))
                            : '-'}
                    </div>
                    <div>~</div>

                    <div>
                        {detailData?.recruitEnd
                            ? new Intl.DateTimeFormat('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            }).format(new Date(detailData.recruitEnd))
                            : '-'}
                    </div>
                </div>

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>참가비</div>
                <div className={`mb20`}>
                    <RadioGroup
                        value={detailData ? detailData.isFree : null} options={[
                        {label: '무료', value: true},
                        {label: '유료', value: false},
                    ]}
                    />
                    {detailData && !detailData.isFree && <div className={`${styles.boxDetail} mt16`}>
                        {detailData ? String(detailData.price) : '-'}
                    </div>}
                </div>


                <div className={`${styles.textRequired} ${styles.noneRequired}`}>추천대상</div>
                <CheckboxGroup options={[
                    {label: "기획자", value: "기획자"},
                    {label: "디자이너", value: "디자이너"},
                    {label: "개발자", value: "개발자"},
                    {label: "AI", value: "AI 개발자"},
                ]} value={detailData ? detailData?.targetRoles : []}
                               className="mb30"
                ></CheckboxGroup>


                <div className={`${styles.textRequired} ${styles.noneRequired}`}>장소</div>
                <RadioBtn option={{label: '오프라인', value: false, groupValue: detailData?.isOnline ?? null}}

                />


                <div className={`${styles.boxDetail} mt12 mb12`}>
                    {detailData ? detailData.locationText : '-'}
                </div>

                <RadioBtn option={{label: '온라인', value: true, groupValue: detailData?.isOnline ?? null}}

                />
                <div className={`${styles.boxDetail} mt12 mb20`}>
                    {detailData ? detailData.locationLink : '-'}
                </div>


                <div className={`${styles.textRequired} ${styles.noneRequired}`}>신청링크</div>
                <div className={`${styles.boxDetail} mb20`}>
                    {detailData ? detailData.applyLink : '-'}
                </div>

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>행사설명</div>
                <div
                    className={`${styles.boxDetail} mb20`}
                    dangerouslySetInnerHTML={{__html: detailData?.description || '-'}}
                />

                <div className={`${styles.textRequired} ${styles.noneRequired}`}>해시태그</div>
                <div className="box-flex gap12">
                    {detailData && detailData.hashTags.map((tag, index) => (
                        <div key={index} className={`${styles.boxDetail}`}>{tag}</div>
                    ))}
                </div>

            </div>


        </>
    );
}
