// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import React, {useState} from "react";
import styles from "../banner.module.scss"


import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createBanner} from "@/api/client";

import {useLoadingStore} from "@/store/loadingStore";
import Swal from "sweetalert2";
import {useRouter} from "next/navigation";
import {BannerFormType, bannerSchema} from "@/validators/banner";
import DatePicker from "react-datepicker";
import {Controller} from "react-hook-form";

import "react-datepicker/dist/react-datepicker.css";


export default function BannerCreatePage() {
    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: {errors, isSubmitted,},
    } = useForm<BannerFormType>({
        resolver: zodResolver(bannerSchema),
        mode: "onChange",
        defaultValues: {},
    });

    const bannerStart = watch("bannerStart");
    const bannerEnd = watch("bannerEnd");

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
    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
    };

    const onSubmit = async (data: BannerFormType) => {
        if (!thumbnail) {
            return;
        }

        showLoading();
        try {
            const payload = {
                ...data,
                bannerStart: formatDate(data.bannerStart),
                bannerEnd: formatDate(data.bannerEnd),
            };
            const response = await createBanner(payload, thumbnail);
            if (response.code == "SUCCESS") {
                Swal.fire({
                    title: '등록되었습니다',
                    confirmButtonText: '확인',
                }).then(() => router.back());
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

    return (
        <>
            <div className="title-page mb32">
                배너 등록
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="box-flex gap24 a-start">
                    <div className="flex3">
                        <div className="container-default mb24 pa24">

                            <div className={styles.textRequired}>
                                서브타이틀
                            </div>
                            <input  {...register("subTitle")} maxLength={20} className="input-default"
                                    placeholder="최대 20글자"/>
                            {errors.subTitle && <div className={styles.errorText}>{errors.subTitle.message}</div>}

                            <div className={`${styles.textRequired} mt16`}>
                                메인타이틀
                            </div>
                            <input  {...register("mainTitle")} maxLength={30} className="input-default"
                                    placeholder="최대 30글자"/>
                            {errors.mainTitle && <div className={styles.errorText}>{errors.mainTitle.message}</div>}

                            <div className={`${styles.textRequired} mt16`}>
                                설명
                            </div>
                            <input  {...register("description")} maxLength={50} className="input-default"
                                    placeholder="최대 50글자"/>
                            {errors.description && <div className={styles.errorText}>{errors.description.message}</div>}


                            <div className={`${styles.textRequired} mt16`}>
                                대표 이미지
                            </div>

                            <input
                                id="thumbnail-upload"
                                className={styles.inputImg}
                                type={"file"} accept="image/*" onChange={handleFileChange}/>

                            <label htmlFor="thumbnail-upload" className={styles.uploadBox}>
                                {preview ? (
                                    <img src={preview} alt="preview" className={styles.previewImg}/>
                                ) : (
                                    "이미지 업로드"
                                )}
                            </label>
                            {!thumbnail && isSubmitted ? <div className={styles.errorText}>썸네일을 등록해주세요</div> : null}

                            <div className={`${styles.textRequired} mt16`}>
                                주소링크
                            </div>
                            <input {...register("bannerLink")}
                                   className="input-default" placeholder="https://medium.com/example-article"/>
                            {errors.bannerLink && <div className={styles.errorText}>{errors.bannerLink.message}</div>}

                            <div className={`${styles.textRequired} mt16`}>
                                등록 기간
                            </div>

                            <div className="box-flex gap8">
                                <Controller
                                    control={control}
                                    name="bannerStart"
                                    render={({field}) => (
                                        <DatePicker
                                            placeholderText="시작 날짜"
                                            selected={field.value}
                                            onChange={(date: unknown) => {
                                                field.onChange(date)
                                            }}
                                            dateFormat="yyyy-MM-dd"
                                            locale={'ko'}
                                            filterDate={(date) => date.getDay() !== 0} // 일요일 비활성화 예시
                                            className="input-default"
                                            maxDate={bannerEnd}
                                            minDate={new Date()}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="bannerEnd"
                                    render={({field}) => (
                                        <DatePicker
                                            placeholderText="종료"
                                            selected={field.value}
                                            onChange={(date: unknown) => {
                                                field.onChange(date)
                                            }}
                                            dateFormat="yyyy-MM-dd"
                                            locale={'ko'}
                                            minDate={bannerStart}

                                            className="input-default"
                                        />
                                    )}
                                />
                            </div>


                        </div>

                    </div>
                    <div className="flex2">

                        <div className="container-default pa24">
                            <div className={styles.titleCard}>
                                관리
                            </div>
                            <button type="submit"
                                    className="btnDefault w100p mb12">등록하기
                            </button>
                            <button type="button" onClick={() => router.back()}
                                    className="btnBorder w100p">취소
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
