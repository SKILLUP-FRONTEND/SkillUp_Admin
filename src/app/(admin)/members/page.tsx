// src/app/(admin)/members/page.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/

"use client";

import ToggleSwitch from "@/components/common/toggle/ToggleSwitch";
import CategoryFilterTabs from "@/components/common/filter/CategoryFilterTabs";
import StatusBadge from "@/components/common/badge/StatusBadge";
import { useEffect, useState} from "react";
import SearchInput from "@/components/common/input/SearchInput";
import {DataTable} from "@/components/common/table/DataTable";
import {useRouter, useSearchParams} from "next/navigation";
import Pagination from "@/components/common/pagination/Pagination";
import {getAllMembers} from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";
import {DataTableColumn} from "@/components/common/table/DataTableColumn";
import {AllMemberModel, MemberModel} from "@/types/member.type";

export default function Members() {
    const [allUserData, setAllUserData] = useState<AllMemberModel | null>(null);
    const [userData, setUserData] = useState<MemberModel[]>([]);

    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const [categories, setCategories] = useState([
        {label: "전체", count: 0, value: "all"},
        {label: "기획", count: 0, value: "plan"},
        {label: "디자인", count: 0, value: "design"},
        {label: "개발", count: 0, value: "dev"},
    ]);
    const searchParams = useSearchParams();

    const page = Number(searchParams.get('page') ?? 0);
    const deleted = searchParams.get('deleted') === 'true';
    const keyword = searchParams.get('keyword') ?? ''

    const [filterData, setFilterData] = useState({
        page: page,
        deleted: deleted,
        keyword: keyword,
    });
    const [selected, setSelected] = useState("all");

    const moveDetail = (row: MemberModel) => {
        router.push(`/members/${row.userId}`)
    }

    const onSelect = (key: string) => {
        setSelected(key);
    };

    const setCategoryUserData=()=>{
        if(allUserData){
            switch (selected) {
                case "all":
                    setUserData(allUserData.users);
                    break;
                case "plan":
                    setUserData(allUserData.pmUsers);
                    break;
                case "design":
                    setUserData(allUserData.designerUsers);
                    break;
                case "dev":
                    setUserData(allUserData.devUsers);
                    break;
            }
        }
    }

    const initData = async () => {
        try {
            setUserData([]);
            showLoading();
            setRouterFilter();
            const result = await getAllMembers(filterData);
            setCategories(prev =>
                prev.map(category => {
                    if (category.value === "all") {
                        return {...category, count: result.data.usersCount};
                    }
                    if (category.value === "plan") {
                        return {...category, count: result.data.pmUsersCount};
                    }
                    if (category.value === "design") {
                        return {...category, count: result.data.designerUsersCount};
                    }
                    if (category.value === "dev") {
                        return {...category, count: result.data.devUsersCount};
                    }
                    return category;
                })
            );
            setAllUserData(result.data);
        } catch (error) {
            console.log(error);
        } finally {
            hideLoading();
        }
    };

    const setDeleteFilter = (value: boolean) => {
        setFilterData(prev => ({...prev, deleted: value}));
    };
    const setPageFilter = (value: number) => {
        setFilterData(prev => ({...prev, page: value}));
    };
    const setKeywordFilter = (value: string) => {
        setFilterData(prev => ({...prev, keyword: value}));
    };


    const setRouterFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(filterData).forEach(([key, value]) => {
            params.set(key, String(value));
        });
        router.replace(`?${params.toString()}`);
    };

    const returnIndex = (index?: number) => {
        return (returnTotalCount() ?? 0) - (page * 10) - (index ?? 0);
    }

    const returnTotalCount = () => {

        switch (selected) {
            case "all":
                return categories.find(category => category.value === "all")?.count;
            case "plan":
                return categories.find(category => category.value === "plan")?.count;
            case "design":
                return categories.find(category => category.value === "design")?.count;
            case "dev":
                return categories.find(category => category.value === "dev")?.count;
            default:
                return 0;
        }
    }


    useEffect(() => {
        initData().then();
    }, [filterData]);

    useEffect(() => {
        setCategoryUserData();
    }, [allUserData,selected]);



    return (
        <>
            <div className="box-flex mb32">
                <div className="title-page mr-auto">회원관리</div>
                <ToggleSwitch
                    label="탈퇴 회원 포함"
                    active={filterData.deleted}
                    onToggleChange={(isActive) => {
                        setDeleteFilter(isActive);
                    }}
                />
            </div>

            <div className="box-flex mb12">
                <CategoryFilterTabs
                    categories={categories}
                    selected={selected}
                    onSelect={onSelect}
                    className="mr-auto"
                />
                <SearchInput onSearch={(keyword) =>{
                    setKeywordFilter(keyword);
                }}
                             initialValue={filterData.keyword}
                />
            </div>
            <div className="container-default">
                <div className="title-table">
                    회원 {userData.length}명
                </div>
                <DataTable<MemberModel> data={userData} onRowClick={(row) => moveDetail(row)}>
                    <DataTableColumn label="No" width={84}>
                        {(row, index) => {
                            return returnIndex(index);
                        }}
                    </DataTableColumn>
                    <DataTableColumn prop="name" label="이름"/>
                    <DataTableColumn prop="email" label="이메일"/>
                    <DataTableColumn prop="createdAt" label="가입일"/>
                    <DataTableColumn prop="socialLoginType" label="로그인 방법"/>
                    <DataTableColumn prop="role" label="직군"></DataTableColumn>
                    <DataTableColumn
                        prop="status"
                        label="상태">
                        {(row) => <StatusBadge status={(row.status == "활성") ? "ACTIVE":"INACTIVE"}/>}
                    </DataTableColumn>
                </DataTable>
                <Pagination
                    currentPage={filterData.page}
                    totalPages={Math.ceil(userData.length / 5)}
                    onPageChange={(page) => {
                        setPageFilter(page);
                    }}
                    hideIfSinglePage={false}
                />
            </div>
        </>
    );
}
