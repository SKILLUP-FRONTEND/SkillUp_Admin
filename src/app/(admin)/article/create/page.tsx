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


export default function ArticleCreatePage() {
    const [data, setData] = useState([]);
    return (
        <>
            <div className="title-page mb32">
                아티클 등록
            </div>
            <div className="box-flex gap24 a-start">
                <div className="fg3">
                    <div className="container-default mb24 pa24">
                        <div>

                        </div>
                    </div>
                    <div className="container-default pa24">11</div>
                </div>
                <div className="container-default fg2 pa24">22</div>

            </div>
        </>
    );
}
