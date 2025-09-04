// src/components/members/MemberTableRow/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-31
  최종 수정일 : 2025-08-31
*/

import { useRouter } from "next/navigation";
import styles from "./style.module.css";
import { Member } from "@/types/member";

interface Props {
  member: Member;
}

export default function MemberTableRow({ member }: Props) {
  const router = useRouter();
  return (
    <tr
      className={styles.memberTableRow}
      onClick={() => router.push(`/admin/members/${member.id}`)}
    >
      <td>
        <div className={styles.ellipsis}>{member.id}</div>
      </td>
      <td>
        <div className={styles.ellipsis}>{member.name}</div>
      </td>
      <td>
        <div className={styles.ellipsis}>{member.email}</div>
      </td>
      <td>
        <div className={styles.ellipsis}>{member.createdAt}</div>
      </td>
      <td>
        <div className={styles.ellipsis}>{member.loginMethod}</div>
      </td>
      <td>
        <div className={styles.ellipsis}>{member.job}</div>
      </td>
      <td>
        <span
          className={`${styles.statusBadge} ${
            member.status === "active" ? styles.active : styles.inactive
          }`}
        >
          {member.status === "active" ? "활동" : "탈퇴"}
        </span>
      </td>
    </tr>
  );
}
