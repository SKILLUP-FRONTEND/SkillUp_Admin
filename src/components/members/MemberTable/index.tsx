// src/components/members/MemberTable/index.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-31
  최종 수정일 : 2025-08-31
*/

import MemberHeader from "../MemberHeader";
import styles from "./style.module.css";
import MemberTableRow from "../MemberTableRow";
import { Member } from "@/types/member";

interface Props {
  members: Member[];
}

export default function MemberTable({ members }: Props) {
  return (
    <div className={styles.memberTable}>
      <table>
        <MemberHeader />
        <tbody>
          {members.map((member, index) => (
            <MemberTableRow key={index} member={member} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
