// src/components/layout/AdminSidebar.tsx
/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/

"use client";

import Image from "next/image";
import skillUpWhiteIcon from "@/assets/skillUpWhiteIcon.svg";
import styles from "./adminLayout.module.css";
import Link from "next/link";
import dashboardIcon from "@/assets/dashboardIcon.svg";
import userEnableIcon from "@/assets/userEnableIcon.svg";
import bannerIcon from "@/assets/bannerIcon.svg";
import eventIcon from "@/assets/eventIcon.svg";
import { usePathname } from "next/navigation";

// TODO : 추후 enable, disabled 아이콘 추가 필요
const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: dashboardIcon },
  { label: "행사관리", href: "/admin/events", icon: eventIcon },
  { label: "배너관리", href: "/admin/banners", icon: bannerIcon },
  { label: "회원관리", href: "/admin/members", icon: userEnableIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.adminSidebar}>
      <div className={styles.adminLogo}>
        <Image src={skillUpWhiteIcon} alt="logo" width={138} height={21} />
        <p>ADMIN</p>
      </div>
      <div className={styles.adminMenu}>
        <span className={styles.adminMenuTitle}>PAGES</span>
        <nav className={styles.adminMenuList}>
          {navItems.map((item, index) => (
            <Link
              href={item.href}
              className={`${styles.adminMenuLink} ${
                pathname === item.href ? styles.active : ""
              }`}
              key={index}
            >
              <Image src={item.icon} alt={item.label} width={16} height={16} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
