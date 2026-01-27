// src/components/layout/AdminHeader.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client"

import Image from "next/image";
import styles from "./adminLayout.module.css";
import bellIcon from "@/assets/bellIcon.svg";
import { useUserStore } from "@/store/userStore";
import {useRouter} from "next/navigation";
import {removeAuthSession} from "@/sessions/auth";
import Swal from "sweetalert2";

export default function AdminHeader() {
    const router = useRouter();
    const user = useUserStore((s) => s.user);
    const setUser = useUserStore((s) => s.setUser);

    const confirmLogout = async () => {
        const result = await Swal.fire({
            title: '로그아웃 하시겠어요?',
            showCancelButton: true,
            confirmButtonText: '로그아웃',
            cancelButtonText: '취소',
            confirmButtonColor: '#d33',
        });

        if(result.value){
            await handleLogout();
        }
    };

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        router.replace("/login");
    };

    return (
        <header className={styles.adminHeader}>
            <div className={styles.adminHeaderRight}>
                <div className={styles.adminHeaderNotification}>
                    <Image src={bellIcon} alt="bell" width={16} height={16}/>
                    <div className={styles.adminHeaderNotificationCount}>1</div>
                </div>
                <h5>{user?.id}</h5>
                <div style={{ cursor: "pointer" }} onClick={confirmLogout}>
                    로그아웃
                </div>
            </div>
        </header>
    );
}
