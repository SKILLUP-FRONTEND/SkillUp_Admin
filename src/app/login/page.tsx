// src/app/login/LoginForm.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-08-27
  최종 수정일 : 2025-08-27
*/

"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import SkillUpIcon from "@/assets/skillUp_black.svg";
import styles from "./login.module.scss";
import {adminLogin, } from "@/api/client";
import {useLoadingStore} from "@/store/loadingStore";
import {useRouter} from "next/navigation";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginFormType, loginSchema} from "@/validators/login";



export default function LoginForm() {
    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);
    const [errorMsg, setErrorMsg] = useState('');
    const [autoLogin, setAutoLogin] = useState(false);


    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<LoginFormType>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    useEffect(() => {
        const subscription = watch((value, {name, type}) => {
            setErrorMsg('');
        });

        return () => subscription.unsubscribe();
    }, [watch]);


    const onSubmit = async (data: LoginFormType) => {
        showLoading();
        try {
            const response = await adminLogin({
                ...data,
                ...{autoLogin: autoLogin}
            });
            if (response.code == "SUCCESS") {
                router.replace("/");
            } else {
                setErrorMsg(response.message);
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formContainer}>
                        <div className={styles.formContent}>

                            <div className={styles.formItemWrap}>
                                <div className={styles.formItem}>
                                    <label className={styles.formItemLabel} htmlFor="userId">
                                        UserID
                                    </label>
                                    <input
                                        {...register("id")}
                                        className={styles.formInput}
                                        placeholder="아이디를 입력해주세요."
                                    />
                                    {errors.id && <div className={styles.errorMessage}>{errors.id.message}</div>}
                                </div>
                                <div className={styles.formItem}>
                                    <label className={styles.formItemLabel} htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        {...register("password")}
                                        className={styles.formInput}
                                        placeholder="비밀번호를 입력해주세요."
                                    />
                                    {errors.password &&
                                        <div className={styles.errorMessage}>{errors.password.message}</div>}
                                </div>
                            </div>


                        </div>
                        {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}


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
                            type="submit"

                        >
                            로그인
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}
