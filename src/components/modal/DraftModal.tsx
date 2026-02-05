"use client";

import {DataTable} from "@/components/common/table/DataTable";
import {EventDraftModel} from "@/types/event.type";
import React, {useEffect, useState} from "react";
import {deleteArticle, deleteDraftEvent, getDraftEvents} from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";
import {useModalStore} from "@/store/modalStore";
import {DataTableColumn} from "@/components/common/table/DataTableColumn";
import Dropdown from "@/components/common/dropdown/Dropdown";

import {Checkbox} from "@/components/common/checkbox/Checkbox";
import Swal from "sweetalert2";

export default function DraftModal({onSelect}: { onSelect: (id: number) => void }) {
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);
    const closeModal = useModalStore((s) => s.closeModal);
    const [data, setData] = useState<EventDraftModel[]>([]);
    const [total, setTotal] = useState(0);
    const [sort, setSort] = useState('CREATED_AT');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const initData = async () => {

        try {
            showLoading();
            const result = await getDraftEvents({
                sort: sort,
            });
            setData(result.data.draftEventRowList);

            setTotal(result.data.totalEventCount);


        } catch (error) {
        } finally {
            hideLoading();
        }
    };

    const handleSelectedId = (id: number) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(e => e !== id);
            } else {
                return [...prev, id];
            }
        });
    }

    const showDelete = async () => {
        const result = await Swal.fire({
            title: '선택한 행사를 삭제하시겠어요?',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#d33',
        });

        if (result.value) {
            await onDelete();
        }
    }

    const onDelete = async () => {
        showLoading();
        try {
            const response = await deleteDraftEvent({});
            if (response.code == "SUCCESS") {
                Swal.fire({
                    title: '삭제되었습니다.',
                    confirmButtonText: '확인',
                }).then(() => initData());
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

    const selectEvent = (id: number) => {
        onSelect(id);
        closeModal();
    }

    useEffect(() => {
        initData().then();
    }, [sort]);
    return <>
        <div className="box-flex mb16 a-center">
            <div className="title-modal mr-auto">
                행사 데이터
            </div>
            <button className="btn-modal" onClick={() => closeModal()}>
            </button>
        </div>
        <div className="box-flex mb16 a-center">
            <div className="title-modal mr16">
                {total}개
            </div>

            {selectedIds.length > 0 &&
                <button className="btn-delete" onClick={() => showDelete()}>
                </button>
            }


            <Dropdown

                options={[
                    {label: "최근 등록순", value: "CREATED_AT"},
                    {label: "모집 종료일 순", value: "DEADLINE"},

                ]}
                value={sort}
                onChange={setSort}
                placeholder="상태 선택"
                className="w140 ml-auto"
            />
        </div>
        <div className="min-w600">
            <DataTable<EventDraftModel>
                data={data} onRowClick={row => {
                selectEvent(row.id)
            }}>
                <DataTableColumn label="" width={50}>
                    {(row: EventDraftModel, index) => {
                        return <Checkbox value={row.id} isActive={selectedIds.includes(row.id)}
                                         onChange={(e) => {
                                             handleSelectedId(e as number)
                                         }}
                        ></Checkbox>
                    }}

                </DataTableColumn>
                <DataTableColumn label="No" width={84}>
                    {(row, index) => {
                        return (index ?? 0) + 1
                    }}
                </DataTableColumn>
                <DataTableColumn prop="title" label="행사명"/>
                <DataTableColumn prop="eventRecruitEnd" label="모집기간"/>
                <DataTableColumn prop="eventPeriodText" label="행사 기간"/>
                <DataTableColumn label="등록일">
                    {(row: EventDraftModel, index) => {
                        if (row.createdAt) {
                            return new Intl.DateTimeFormat('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            }).format(new Date(row.createdAt))
                        }
                        return '-';
                    }}


                </DataTableColumn>

            </DataTable>
        </div>
    </>;
}