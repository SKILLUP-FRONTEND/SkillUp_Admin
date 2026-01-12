// src/app/login/LoginForm.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-27
  최종 수정일 : 2025-08-27
*/

"use client";

import { useState } from "react";
import Image from "next/image";
import SkillUpIcon from "@/assets/skillUp_black.svg";
import styles from "./login.module.css";
import { adminLogin } from "@/api/instance";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
  };

  const handleApiTest = async () => {
    try {
      console.log("API 테스트 시작...");
      const response = await adminLogin();
      console.log("API 응답 성공:", response);
      alert(`API 테스트 성공!\n${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.error("API 에러:", error);
      alert(`API 테스트 실패!\n${error}`);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoContainer}>
        <Image src={SkillUpIcon} alt="logo" width={172} height={26} />
        <p>ADMIN</p>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.formContent}>
          <div className={styles.formItemWrap}>
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
          </div>
          {/* TODO : 추후 분기 필요 */}
          <div className={styles.errorMessage}>
            <p>등록된 계정이 아니에요</p>
          </div>
        </div>

        <div className={styles.checkWrap}>
          <input type="checkbox" id="autoLogin" className={styles.checkInput} />
          <label className={styles.checkLabel} htmlFor="autoLogin">
            자동 로그인
          </label>
        </div>
        <div className={styles.buttonWrap}>
          <button
            className={styles.loginButton}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
          <button
            className={styles.loginButton}
            onClick={handleApiTest}
            style={{ marginTop: '10px', backgroundColor: '#6B7280' }}
          >
            API 테스트
          </button>
        </div>
      </div>
    </div>
  );
}
