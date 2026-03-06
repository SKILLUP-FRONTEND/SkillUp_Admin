// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import React, {useRef, useState} from "react";
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
import Cropper, {type Area, Point} from "react-easy-crop";


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

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const bannerStart = watch("bannerStart");
    const bannerEnd = watch("bannerEnd");

    const [thumbnail, setThumbnail] = useState<File | null>(null);


    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const createImage = (url: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.addEventListener("load", () => resolve(img));
            img.addEventListener("error", reject);
            img.src = url;
        });

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

    const handleZoom = async (zoom: number) => {
        setZoom(zoom);
        await handleCropDone();
    }

    const handleCrop = async (location: Point) => {
        setCrop(location);
        await handleCropDone();
    }

    const handleCropDone = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
        setThumbnail(croppedFile);
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
                                {imageSrc ?
                                    (

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
                                                onCropChange={handleCrop}
                                                objectFit="horizontal-cover"
                                                onZoomChange={handleZoom}
                                                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}

                                            />
                                        </div>
                                    ):
                                    (
                                    <div className={styles.uploadLabel}>
                                        이미지 업로드
                                    </div>
                                )}
                            </div>
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
                                            className="input-default"
                                            maxDate={bannerEnd}
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
