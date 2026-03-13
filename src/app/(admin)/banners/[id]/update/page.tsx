// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import React, {useEffect, useRef, useState} from "react";
import styles from "../../banner.module.scss"


import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {getBannerDetail, updateBanner} from "@/api/client";

import {useLoadingStore} from "@/store/loadingStore";
import Swal from "sweetalert2";
import {useParams, useRouter} from "next/navigation";
import DatePicker from "react-datepicker";
import {bannerSchema, BannerFormType} from "@/validators/banner";
import "react-datepicker/dist/react-datepicker.css";
import Cropper, {type Area, Point} from "react-easy-crop";

export default function BannerUpdatePage() {
    const params = useParams();
    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: {errors, isSubmitted},
    } = useForm<BannerFormType>({
        resolver: zodResolver(bannerSchema),
        mode: "onChange",
        defaultValues: {},
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);


    const handleCropDone = async (targetPixels: Area) => {
        if (!imageSrc || !targetPixels) return;
        try {
            const croppedFile = await getCroppedImg(imageSrc, targetPixels);
            setThumbnail(croppedFile);

        } catch (e) {
            console.error(e);
        }
    };

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise<File>((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) return;
                const file = new File([blob], "thumbnail.jpg", {type: "image/jpeg"});
                resolve(file);
            }, "image/jpeg");
        });
    };

    const createImage = (url: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.addEventListener("load", () => resolve(img));
            img.addEventListener("error", reject);
            img.src = url;
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
            setImageSrc(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const getLimitDate = (val: string | null) => {
        return val ? new Date(String(val).replace('Z', '')) : undefined;
    };

    const onSubmit = async (data: BannerFormType) => {
        showLoading();
        try {
            const bannerId = Array.isArray(params.id) ? params.id[0] : params.id;

            const response = await updateBanner(data, bannerId!, thumbnail,);
            if (response.code == "SUCCESS") {
                Swal.fire({
                    title: '수정되었습니다',
                    confirmButtonText: '확인',
                }).then(() => router.back());

            } else {
                Swal.fire({
                    title: '수정에 실패했습니다',
                    confirmButtonText: '확인',
                }).then();
            }
        } catch (error) {
            Swal.fire({
                title: '수정에 실패했습니다',
                confirmButtonText: '확인',
            }).then();
        } finally {
            hideLoading();
        }
    };

    const initData = async () => {
        try {
            showLoading();
            const result = await getBannerDetail({id: params.id});
            const data = result.data;
            setValue("subTitle", data.subTitle, {shouldValidate: true});
            setValue("mainTitle", data.mainTitle, {shouldValidate: true});
            setValue("description", data.description, {shouldValidate: true});
            setValue("bannerLink", data.bannerLink, {shouldValidate: true});
            setValue("bannerStart", data.startAt, {shouldValidate: true});
            setValue("bannerEnd", data.endAt, {shouldValidate: true});

            setPreview(data.bannerImageUrl);

        } catch (error) {
        } finally {
            hideLoading();
        }
    };


    useEffect(() => {
        initData().then();
    }, []);

    return (
        <>
            <div className="title-page mb32">
                배너 수정
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="box-flex gap24 a-start">
                    {errors.subTitle && <div className={styles.errorText}>{errors.subTitle.message}</div>}
                    {errors.mainTitle && <div className={styles.errorText}>{errors.mainTitle.message}</div>}
                    {errors.description && <div className={styles.errorText}>{errors.description.message}</div>}
                    {errors.bannerLink && <div className={styles.errorText}>{errors.bannerLink.message}</div>}
                    {errors.bannerStart && <div className={styles.errorText}>{errors.bannerStart.message}</div>}
                    {errors.bannerEnd && <div className={styles.errorText}>{errors.bannerEnd.message}</div>}
                    <div className="flex3">
                        <div className="container-default mb24 pa24">

                            <div className={`${styles.textRequired} ${styles.noneRequired}`}>
                                서브타이틀
                            </div>
                            <input  {...register("subTitle")} maxLength={30} className="input-default"
                                    placeholder="최대 30글자"/>
                            {errors.subTitle && <div className={styles.errorText}>{errors.subTitle.message}</div>}

                            <div className={`${styles.textRequired} mt16`}>
                                메인타이틀
                            </div>
                            <textarea  {...register("mainTitle")} maxLength={50} className="textarea-default"
                                    placeholder="최대 50글자"/>
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
                                ref={fileInputRef}
                                className={styles.inputImg}
                                type={"file"} accept="image/*" onChange={handleFileChange}/>
                            <div
                                className={styles.uploadBox}
                                onClick={() => {
                                    if (isDragging) {
                                        return;
                                    }
                                    fileInputRef.current?.click();
                                }}
                            >
                                {imageSrc ? (
                                    <div className={styles.inlineCropper}
                                         onMouseDown={() => (setIsDragging(false))}
                                         onMouseMove={() => (setIsDragging(true))}
                                         onTouchStart={() => (setIsDragging(false))}
                                         onTouchMove={() => (setIsDragging(true))}
                                    >
                                        <Cropper
                                            image={imageSrc}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={16 / 9}
                                            onCropChange={setCrop}
                                            onZoomChange={setZoom}
                                            objectFit="horizontal-cover"
                                            onCropComplete={(_, croppedPixels) => {
                                                void handleCropDone(croppedPixels);
                                            }}

                                        />
                                    </div>
                                ) : preview ? (
                                        <img src={preview} alt="preview" className={styles.previewImg}/>
                                    ) :
                                    (
                                        <div className={styles.uploadLabel}>
                                            이미지 업로드
                                        </div>
                                    )}
                            </div>
                            {!preview && isSubmitted ? <div className={styles.errorText}>썸네일을 등록해주세요</div> : null}

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
                                        <Controller
                                            control={control}
                                            name="bannerStart"
                                            render={({ field }) => {
                                                const getDisplayValue = (val: unknown) => {
                                                    if (!val) return null;
                                                    const date = new Date(String(val).replace('Z', ''));
                                                    return isNaN(date.getTime()) ? null : date;
                                                };

                                                const handleUpdate = (date: Date | null) => {
                                                    if (!date || isNaN(date.getTime())) {
                                                        if (field.value !== null) field.onChange(null);
                                                        return;
                                                    }

                                                    const pad = (n: number) => n.toString().padStart(2, '0');
                                                    const isoString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00.000Z`;

                                                    if (field.value !== isoString) {
                                                        field.onChange(isoString);
                                                    }
                                                };

                                                return (
                                                    <DatePicker
                                                        placeholderText="시작 날짜"
                                                        selected={getDisplayValue(field.value)}
                                                        onChange={handleUpdate}
                                                        dateFormat="yyyy-MM-dd"
                                                        className="input-default"
                                                        maxDate={getLimitDate(bannerEnd)}
                                                    />
                                                );
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="bannerEnd"
                                    render={({ field }) => {
                                        const getDisplayValue = (val: unknown) => {
                                            if (!val) return null;
                                            const date = new Date(String(val).replace('Z', ''));
                                            return isNaN(date.getTime()) ? null : date;
                                        };

                                        const handleUpdate = (date: Date | null) => {
                                            if (!date || isNaN(date.getTime())) {
                                                if (field.value !== null) field.onChange(null);
                                                return;
                                            }

                                            const pad = (n: number) => n.toString().padStart(2, '0');
                                            const isoString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00.000Z`;

                                            if (field.value !== isoString) {
                                                field.onChange(isoString);
                                            }
                                        };

                                        return (
                                            <DatePicker
                                                placeholderText="종료 날짜"
                                                selected={getDisplayValue(field.value)}
                                                onChange={handleUpdate}
                                                dateFormat="yyyy-MM-dd"
                                                className="input-default"
                                                minDate={getLimitDate(bannerStart)}
                                            />
                                        );
                                    }}
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
                                    className="btnDefault w100p mb12">수정하기
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
