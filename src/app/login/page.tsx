// src/app/login/LoginForm.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-27
  최종 수정일 : 2025-08-27
*/

"use client";

import {useState} from "react";
import Image from "next/image";
import SkillUpIcon from "@/assets/skillUp_black.svg";
import styles from "./login.module.scss";
import {login} from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";
import {useRouter} from "next/navigation";
import {useUserStore} from "@/store/userStore";


export default function LoginForm() {
    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);
    const [errorMsg, setErrorMsg] = useState('');
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [autoLogin, setAutoLogin] = useState(false);

    const setUser = useUserStore((s) => s.setUser);

    const handleLogin = async () => {
        showLoading();
        try {
            const response =  await login(userId, password);
            if(response.code == "SUCCESS") {
                router.replace("/");
            }else{
                setErrorMsg('잠시 후 다시 시도해주세요');
            }
        } catch (error) {
            setErrorMsg('잠시 후 다시 시도해주세요');
        } finally {
            hideLoading();
        }
    };
    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                <div className={styles.logoContainer}>
                    <Image src={SkillUpIcon} alt="logo" width={172} height={26}/>
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
                                    className={styles.formInput}
                                    placeholder="아이디를 입력해주세요."
                                    value={userId}
                                    onChange={(e) => {
                                        setErrorMsg('');
                                        setUserId(e.target.value);
                                    }}
                                />
                            </div>
                            <div className={styles.formItem}>
                                <label className={styles.formItemLabel} htmlFor="password">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className={styles.formInput}
                                    value={password}
                                    onChange={(e) => {
                                        setErrorMsg('');
                                        setPassword(e.target.value);
                                    }}
                                    placeholder="비밀번호를 입력해주세요."
                                />
                            </div>
                        </div>
                        {errorMsg && (<div className={styles.errorMessage}>
                            <p>{errorMsg}</p>
                        </div>)}

                    </div>

                    <div className={styles.checkWrap}>
                        <input type="checkbox" checked={autoLogin}
                               onChange={(e) => setAutoLogin(e.target.checked)}
                               className={styles.checkInput}/>
                        <label className={styles.checkLabel} htmlFor="autoLogin">
                            자동 로그인
                        </label>
                    </div>
                    <button
                        className={styles.btnLogin}
                        onClick={handleLogin}
                    >
                        로그인
                    </button>
                </div>
            </div>
        </div>
    );
}
