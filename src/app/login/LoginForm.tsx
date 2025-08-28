// src/app/login/LoginForm.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-27
  최종 수정일 : 2025-08-27
*/

import Image from "next/image";
import skillUpIcon from "@/assets/skillUpIcon.svg";
import styles from "./login.module.css";

export default function LoginForm() {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoContainer}>
        <Image src={skillUpIcon} alt="logo" width={172} height={26} />
        <p>ADMIN</p>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.formWrap}>
          <div className={styles.formItem}>
            <label className={styles.formItemLabel} htmlFor="userId">
              UserID
            </label>
            <input
              type="text"
              id="userId"
              className={styles.formInput}
              placeholder="아이디를 입력해주세요."
            />
          </div>
          <div className={styles.formItem}>
            <label className={styles.formItemLabel} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={styles.formInput}
              placeholder="비밀번호를 입력해주세요."
            />
          </div>
          <div className={styles.checkWrap}>
            <input type="checkbox" id="autoLogin" />
            <label className={styles.checkLabel} htmlFor="autoLogin">
              자동 로그인
            </label>
          </div>
          <div className={styles.buttonWrap}>
            <button className={styles.loginButton}>로그인</button>
          </div>
        </div>
      </div>
    </div>
  );
}
