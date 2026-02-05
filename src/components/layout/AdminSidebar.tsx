// src/components/layout/AdminSidebar.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-09-02
*/

"use client";

import Image from "next/image";
import SkillUpWhiteIcon from "@/assets/skillUp_white.svg";
import styles from "./adminLayout.module.scss";
import Link from "next/link";
import {usePathname} from "next/navigation";

const navItems = [
    {
        label: "행사관리",
        href: "/events",
        className: 'event',
    },
    {
        label: "아티클 관리",
        href: "/articles",
        className: 'article',
    },
    {
        label: "배너관리",
        href: "/banners",
        className: 'banner',
    },
    {
        label: "회원관리",
        href: "/members",
        className: 'member',
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className={styles.adminSidebar}>
            <div className={styles.adminLogo}>
                <Image src={SkillUpWhiteIcon} alt="logo" width={138} height={21}/>
                <p>ADMIN</p>
            </div>
            <div>
                <span className={styles.adminMenuTitle}>PAGES</span>
                <nav>
                    {navItems.map((item, index) => (
                        <Link
                            href={item.href}
                            className={`${styles.adminMenuLink}  ${styles[item.className]} ${
                                pathname.includes(item.href) ? styles.active : ""
                            } `}
                            key={index}
                        >
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}
