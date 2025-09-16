/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-21
  최종 수정일 : 2025-08-27
*/

import LoginForm from "@/app/LoginForm";
import styles from "./login.module.css";

export default function Login() {
  return (
    <div id="wrap">
      <div className={styles.loginPage}>
        <LoginForm />
      </div>
    </div>
  );
}
