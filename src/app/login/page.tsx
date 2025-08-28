/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-21
  최종 수정일 : 2025-08-27
*/

import Link from "next/link";
import LoginForm from "@/app/login/LoginForm";
import styles from "./login.module.css";

export default function Login() {
  return (
    <div id="wrap">
      <p id="skipNav" className="hide">
        <Link href="/">본문 바로가기</Link>
      </p>

      <div className={styles.loginPage}>
        <LoginForm />
      </div>
    </div>
  );
}
