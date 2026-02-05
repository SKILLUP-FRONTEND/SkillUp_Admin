// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import React, {useState} from "react";
import styles from "../article.module.scss"

import {ArticleFormType, articleSchema} from "@/validators/article";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CheckboxGroup} from "@/components/common/checkbox/CheckboxGroup";
import {createArticle} from "@/api/client";

import {useLoadingStore} from "@/store/loadingStore";
import Swal from "sweetalert2";
import {useRouter} from "next/navigation";


export default function ArticleCreatePage() {
    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {errors,isSubmitted},
    } = useForm<ArticleFormType>({
        resolver: zodResolver(articleSchema),
        mode: "onChange",
        defaultValues: {
            targetRoles: [],
        },
    });

    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setThumbnail(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleActionSubmit = async (status: string) => {


        setValue("status", status);
        await handleSubmit(onSubmit)();

    }

    const onSubmit = async (data: ArticleFormType) => {
        if(!thumbnail){
            return;
        }

        showLoading();
        try {
            const response = await createArticle(data, thumbnail);
            if (response.code == "SUCCESS") {
                Swal.fire({
                    title: '등록되었습니다',
                    confirmButtonText: '확인',
                }).then();
                router.back();
            } else {
                Swal.fire({
                    title: '등록에 실패했습니다',
                    confirmButtonText: '확인',
                }).then();
            }
        } catch (error) {
            Swal.fire({
                title: '등록에 실패했습니다',
                confirmButtonText: '확인',
            }).then();
        } finally {
            hideLoading();
        }
    };
    const targetRoles = watch("targetRoles");

    return (
        <>
            <div className="title-page mb32">
                아티클 등록
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="box-flex gap24 a-start">
                    <div className="flex3">
                        <div className="container-default mb24 pa24">
                            <div className={styles.titleCard}>
                                기본 정보
                            </div>
                            <div className={styles.textRequired}>
                                제목
                            </div>
                            <input  {...register("title")} className="input-default"
                                    placeholder="디자인 시스템 구축을 위한 실전 가이드"/>
                            {errors.title && <div className={styles.errorText}>{errors.title.message}</div>}

                            <div className={`${styles.textRequired} mt16`}>
                                원문 링크 URL
                            </div>
                            <input {...register("originalUrl")}
                                   className="input-default" placeholder="https://medium.com/example-article"/>
                            {errors.originalUrl && <div className={styles.errorText}>{errors.originalUrl.message}</div>}


                            <div className={`${styles.textRequired} mt16`}>
                                요약
                            </div>
                            <textarea {...register("summary")} maxLength={30} className="textarea-default" rows={5}
                                      placeholder="30자 이내로 요약을 입력하세요"/>
                            {errors.summary && <div className={styles.errorText}>{errors.summary.message}</div>}

                            <div className={`${styles.textRequired} mt16`}>
                                출처
                            </div>
                            <input {...register("source")} className="input-default"/>
                            {errors.source && <div className={styles.errorText}>{errors.source.message}</div>}

                        </div>
                        <div className="container-default pa24">
                            <div className={styles.titleCard}>
                                썸네일 이미지
                            </div>
                            <div className={`${styles.textRequired} mt16`}>
                                이미지 파일
                            </div>
                            <input
                                id="thumbnail-upload"
                                className={styles.inputImg}
                                type={"file"} accept="image/*" onChange={handleFileChange}/>

                            <label htmlFor="thumbnail-upload" className={styles.uploadBox}>
                                {preview ? (
                                    <img src={preview} alt="preview" className={styles.previewImg}/>
                                ) : (
                                    "썸네일 업로드"
                                )}
                            </label>
                            {!thumbnail && isSubmitted? <div className={styles.errorText}>썸네일을 등록해주세요</div> : null}
                        </div>
                    </div>
                    <div className="flex2">
                        <div className="container-default pa24 mb24">
                            <div className={styles.titleCard}>
                                추가 정보
                            </div>
                            <div className={styles.textRequired}>
                                원문 게시일
                            </div>
                            <input {...register("originalPublishedDate")}
                                   onChange={(e) => {
                                       let val = e.target.value.replace(/\D/g, ""); // 숫자만
                                       if (val.length >= 5) {
                                           val = val.replace(/^(\d{4})(\d{1,2})(\d{1,2})$/, "$1-$2-$3");
                                       } else if (val.length >= 3) {
                                           val = val.replace(/^(\d{4})(\d{1,2})$/, "$1-$2");
                                       }
                                       setValue("originalPublishedDate", val, {shouldValidate: true})

                                   }}
                                   maxLength={10} className="input-default" placeholder="YYYY-MM-DD"/>
                            {errors.originalPublishedDate &&
                                <div className={styles.errorText}>{errors.originalPublishedDate.message}</div>}


                            <CheckboxGroup
                                className="mt16"
                                options={[
                                    {label: "기획자", value: "기획자"},
                                    {label: "디자이너", value: "디자이너"},
                                    {label: "개발자", value: "개발자"},
                                    {label: "AI", value: "AI 개발자"},
                                ]}
                                value={targetRoles}
                                onChange={(val) => setValue("targetRoles", val, {shouldValidate: true})}
                            />
                            {errors.targetRoles && (
                                <div className={styles.errorText}>{errors.targetRoles.message}</div>
                            )}

                        </div>
                        <div className="container-default pa24">
                            <div className={styles.titleCard}>
                                관리
                            </div>
                            <button type="button" onClick={() => handleActionSubmit('PUBLISHED')}
                                    className="btnDefault w100p mb12">등록하기
                            </button>
                            <button type="button" onClick={() => handleActionSubmit('DRAFT')}
                                    className="btnBorder w100p">임시 저장
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
