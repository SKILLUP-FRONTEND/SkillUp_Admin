// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import {DataTable} from "@/components/common/table/DataTable";
import {DataTableColumn} from "@/components/common/table/DataTableColumn";
import {Member} from "@/types/member.type";
import StatusBadge from "@/components/common/badge/StatusBadge";
import {useState} from "react";

const userColumns = [
    {key: "id", header: "No", width: "50px"},
    {key: "name", header: "이름", width: "100px"},
    {key: "email", header: "이메일", width: "220px"},
    {key: "createdAt", header: "가입일", width: "180px"},
    {key: "loginMethod", header: "로그인 방법", width: "100px"},
    {key: "job", header: "직군", width: "100px"},
    {
        key: "status",
        header: "상태",
        width: "80px",
        render: (item: Member) => <StatusBadge status={item.status}/>,
    },
];

export default function Banners() {
    const [data,setData] = useState([]);
    return (
        <>
            <div className="box-flex mb32">
                <div className="title-page mr-auto">배너 관리</div>
                <button className="btnDefault">+ 신규 등록</button>

            </div>

            <div className="container-default">
                <DataTable data={data} onRowClick={(row) => console.log(row)}>
                    <DataTableColumn prop="id" label="No" width="50px" />
                    <DataTableColumn prop="name" label="이름" />
                    <DataTableColumn prop="email" label="이메일" />
                    <DataTableColumn
                        prop="status"
                        label="상태"
                    />
                </DataTable>


            </div>
        </>
    );
}
