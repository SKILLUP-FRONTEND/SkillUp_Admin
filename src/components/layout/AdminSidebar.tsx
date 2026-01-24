// src/components/layout/AdminSidebar.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-09-02
*/

"use client";

import Image from "next/image";
import SkillUpWhiteIcon from "@/assets/skillUp_white.svg";
import styles from "./adminLayout.module.css";
import Link from "next/link";
import LayoutActiveIcon from "@/assets/layout_active.svg";
import LayoutInactiveIcon from "@/assets/layout_inactive.svg";
import LayerActiveIcon from "@/assets/layer_active.svg";
import LayerInactiveIcon from "@/assets/layer_inactive.svg";
import BoardActiveIcon from "@/assets/board_active.svg";
import BoardInactiveIcon from "@/assets/board_inactive.svg";
import PersonInactiveIcon from "@/assets/person_inactive.svg";
import PersonActiveIcon from "@/assets/person_active.svg";
import {usePathname} from "next/navigation";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        activeIcon: LayoutActiveIcon,
        inactiveIcon: LayoutInactiveIcon,
    },
    {
        label: "행사관리",
        href: "/events",
        activeIcon: LayerActiveIcon,
        inactiveIcon: LayerInactiveIcon,
    },
    {
        label: "배너관리",
        href: "/banners",
        activeIcon: BoardActiveIcon,
        inactiveIcon: BoardInactiveIcon,
    },
    {
        label: "회원관리",
        href: "/members",
        activeIcon: PersonActiveIcon,
        inactiveIcon: PersonInactiveIcon,
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
            <div className={styles.adminMenu}>
                <span className={styles.adminMenuTitle}>PAGES</span>
                <nav className={styles.adminMenuList}>
                    {navItems.map((item, index) => (
                        <Link
                            href={item.href}
                            className={`${styles.adminMenuLink} ${
                                pathname.includes(item.href) ? styles.active : ""
                            }`}
                            key={index}
                        >
                            <Image
                                src={
                                    pathname.includes(item.href)
                                        ? item.activeIcon
                                        : item.inactiveIcon
                                }
                                alt={item.label}
                                width={16}
                                height={16}
                            />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}
