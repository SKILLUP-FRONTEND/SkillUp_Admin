// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import React, {useRef, useState} from "react";
import styles from "../events.module.scss"

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';


import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {useLoadingStore} from "@/store/loadingStore";
import Swal from "sweetalert2";
import {useRouter} from "next/navigation";
import DatePicker from "react-datepicker";
import {Controller} from "react-hook-form";

import "react-datepicker/dist/react-datepicker.css";
import {EventFormType, eventSchema} from "@/validators/event";
import {CheckboxGroup} from "@/components/common/checkbox/CheckboxGroup";
import {RadioGroup} from "@/components/common/radio/RadioGroup";
import {RadioBtn} from "@/components/common/radio/RadioBtn";
import {createDraftEvent, createEvent, getEventDetail, registDraftEvent} from "@/api/client";
import {useModalStore} from "@/store/modalStore";
import Cropper, {Point} from "react-easy-crop";
import type {Area} from "react-easy-crop";

import DraftModal from "@/components/modal/DraftModal";
import {AxiosResponse} from "axios";

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,

});

const modules = {
    toolbar: [
        [{header: [1, 2, false]}],
        ['bold', 'italic', 'underline', 'strike'],
        ['image', 'link'], // 이미지 버튼 추가
        ['clean'],
    ],
};



export default function EventsCreatePage() {

    const enum EventActionType {
        CREATE = 'create',
        CREATE_DRAFT = 'createDraft',
        REGIST_DRAFT = 'registDraft',
    }
    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);
    const showModal = useModalStore((s) => s.openModal);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const [isDragging, setIsDragging] = useState(false);


    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: {errors,},
    } = useForm<EventFormType>({
        resolver: zodResolver(eventSchema),
        mode: "all",
        defaultValues: {
            category: 'CONFERENCE_SEMINAR',
            targetRoles: [],
            hashTags: [],
            isFree: true,
            isOnline: false,
            price: 0,
        },
    });

    const eventStart = watch("eventStart");
    const eventEnd = watch("eventEnd");
    const recruitStart = watch("recruitStart");
    const recruitEnd = watch("recruitEnd");
    const hashTags = watch("hashTags");
    const category = watch("category");
    const isFree = watch("isFree");
    const price = watch("price");
    const isOnline = watch("isOnline");

    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const [draftId, setDraftId] = useState<number | null>(null);


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

    const returnFailType = (type: string) => {
        switch (type) {
            case "MAP_GEOCODE_ERROR":
                return '주소를 불러오지 못 했습니다.';
            case "COORDINATE_NOT_FOUND":
                return '주소를 불러오지 못 했습니다.';

        }
        return '등록에 실패했습니다';
    }


    const onSubmit = async (data: EventFormType, type: EventActionType) => {

        showLoading();
        try {
            const eventActions: Record<
                EventActionType,
                (d: EventFormType, t: File | null, id?: number | null) => Promise<AxiosResponse["data"]>
            > = {
                [EventActionType.CREATE]: (d, t) => createEvent(d, t),
                [EventActionType.CREATE_DRAFT]: (d, t) => createDraftEvent(d, t),
                [EventActionType.REGIST_DRAFT]: (d, t, id) => {
                    if (!id) throw new Error("Draft ID가 필요합니다.");
                    return registDraftEvent(d,t,id );
                },
            };

            const action = eventActions[type];

            const response = await action(data, thumbnail,draftId);
            if (response.code == "SUCCESS") {
                Swal.fire({
                    title: '등록되었습니다',
                    confirmButtonText: '확인',
                }).then(() => {
                    if(type != EventActionType.CREATE_DRAFT) {
                        router.back();
                    }
                });

            } else {
                const failType = returnFailType(response.code);
                Swal.fire({
                    title: failType,
                    confirmButtonText: '확인',
                }).then();
            }
        } catch (error) {

            Swal.fire({
                title: `등록에 실패했습니다`,
                confirmButtonText: '확인',
            }).then();
        } finally {
            hideLoading();
        }
    };

    const targetRoles = watch("targetRoles");

    const addTags = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === 'Enter') {
            e.preventDefault();

            if (hashTags.length >= 5) {
                return;
            }

            const value = e.currentTarget.value.trim();
            if (value) {
                const nArray = [...hashTags, `#${value}`];
                setValue("hashTags", nArray, {shouldValidate: true,});
                e.currentTarget.value = "";
            }
        }
    }

    const removeHashTag = (index: number) => {
        const nArray = hashTags.filter((_, i) => i !== index);
        setValue("hashTags", nArray);
    }

    const handleCreateSubmit = async () => {
        let type = EventActionType.CREATE;

        if(draftId != null) {
            type = EventActionType.REGIST_DRAFT;
        }

        await handleSubmit((e) => {
            onSubmit(e, type);
        })();
    }

    const handleDraftSubmit = async () => {
        await handleSubmit((e) => {
            onSubmit(e, EventActionType.CREATE_DRAFT);
        })();
    }


    const setSelectDraft = async (id: number) => {
        try {
            showLoading();
            const result = await getEventDetail({id: id});
            const data = result.data;
            setDraftId(id);
            setValue("title", data.title, {shouldValidate: true});
            setValue("category", data.category, {shouldValidate: true});
            setValue("eventStart", new Date(data.eventStart), {shouldValidate: true});
            setValue("eventEnd", new Date(data.eventEnd), {shouldValidate: true});
            setValue("recruitStart", data.recruitStart != null? new Date(data.recruitStart) : null, {shouldValidate: true});
            setValue("recruitEnd", data.recruitEnd != null? new Date(data.recruitEnd) : null, {shouldValidate: true});
            setValue("targetRoles", data.targetRoles, {shouldValidate: true});
            setValue('isFree', data.isFree, {shouldValidate: true});
            setValue('price', data.price, {shouldValidate: true});
            setValue('isOnline', data.isOnline, {shouldValidate: true});
            setValue('locationText', data.locationText, {shouldValidate: true});
            setValue('locationLink', data.locationLink, {shouldValidate: true});
            setValue('applyLink', data.applyLink, {shouldValidate: true});
            setValue('contact', data.contact, {shouldValidate: true});
            setValue('description', data.description, {shouldValidate: true});
            setValue('hashTags', data.hashTags, {shouldValidate: true});


            // setPreview(data.thumbnailUrl);

        } catch (error) {
        } finally {
            hideLoading();
        }
    }


    return (
        <>
            <div className="box-flex mb32">

                <div className="title-page mr-auto">
                    행사 등록
                </div>
                <button className="btnDefault" onClick={() => showModal(<DraftModal onSelect={(e) => {

                    setSelectDraft(e).then();
                }}/>)}>불러오기
                </button>
            </div>
            <form>
                <div className="box-flex gap24 a-start">
                    <div className="flex3">
                        <div className="container-default mb24 pa24">


                            <div className={styles.textRequired}>
                                행사명
                            </div>
                            <input  {...register("title")} maxLength={40} className="input-default"
                                    placeholder="최대 40글자"/>
                            {errors.title && <div className={styles.errorText}>{errors.title.message}</div>}


                            <div className={`${styles.textRequired} ${styles.noneRequired} mt16`}>
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
                                {!imageSrc && (
                                    <div className={styles.uploadLabel}>
                                        이미지 업로드
                                    </div>
                                )}

                                {imageSrc && (

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
                                            objectFit="cover"
                                            onZoomChange={handleZoom}
                                            onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={`${styles.textRequired} mt16`}>
                                카테고리
                            </div>
                            <RadioGroup
                                value={category} options={[
                                {label: '컨퍼런스/세미나', value: 'CONFERENCE_SEMINAR'},
                                {label: '공모전/해커톤', value: 'COMPETITION_HACKATHON'},
                                {label: '부트캠프/동아리', value: 'BOOTCAMP_CLUB'},
                                {label: '네트워킹/멘토링', value: 'NETWORKING_MENTORING'},
                            ]} onChange={(val) => setValue("category", String(val))}
                            />

                            <div className={`${styles.textRequired} mt16`}>
                                행사 기간
                            </div>

                            <div className="box-flex gap8">
                                <Controller
                                    control={control}
                                    name="eventStart"
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
                                            maxDate={eventEnd}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="eventEnd"
                                    render={({field}) => (
                                        <DatePicker
                                            placeholderText="종료 날짜"
                                            selected={field.value}
                                            onChange={(date: unknown) => {
                                                field.onChange(date)
                                            }}
                                            dateFormat="yyyy-MM-dd"
                                            locale={'ko'}
                                            minDate={eventStart}
                                            className="input-default"
                                        />
                                    )}
                                />
                            </div>
                            {(errors.eventStart || errors.eventEnd) &&
                                <div className={styles.errorText}>행사 기간은 필수입니다.</div>}

                            <div className={`${styles.textRequired} ${styles.noneRequired} mt16`}>
                                모집 기간
                            </div>


                            <Controller
                                control={control}
                                name="recruitStart"
                                render={({field}) => (
                                    <div className="box-flex gap8 mb8">
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: unknown) => {
                                                field.onChange(date);
                                            }}
                                            placeholderText="날짜 선택"
                                            dateFormat="yyyy-MM-dd"
                                            locale="ko"
                                            maxDate={recruitEnd != null ? recruitEnd! : undefined}
                                            className="input-default"
                                        />

                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: unknown) => {
                                                field.onChange(date);
                                            }}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="시간"
                                            dateFormat="HH:mm"
                                            placeholderText="시간 선택"
                                            className="input-default"
                                        />
                                    </div>
                                )}
                            />

                            <Controller
                                control={control}
                                name="recruitEnd"
                                render={({field}) => (
                                    <div className="box-flex gap8 ">
                                        <DatePicker
                                            placeholderText="종료 날짜"
                                            selected={field.value}
                                            onChange={(date: unknown) => {
                                                field.onChange(date)
                                            }}
                                            dateFormat="yyyy-MM-dd"
                                            locale={'ko'}
                                            minDate={recruitStart != null ? recruitStart! : undefined}
                                            className="input-default"
                                        />
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: unknown) => {
                                                field.onChange(date);
                                            }}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="시간"
                                            dateFormat="HH:mm"
                                            placeholderText="시간 선택"
                                            className="input-default"
                                        />
                                    </div>


                                )}
                            />


                            <div className={`${styles.textRequired} mt16`}>
                                참가비
                            </div>
                            <RadioGroup
                                value={isFree} options={[
                                {label: '무료', value: true},
                                {label: '유료', value: false},
                            ]} onChange={(val) => setValue("isFree", Boolean(val))}
                            />

                            {!isFree &&
                                <>
                                    <input {...register("price", {valueAsNumber: true})}
                                           type="number"
                                           className="input-default mt8" placeholder="가격을 입력해주세요."/>
                                    {(errors.price || (price ?? 0) <= 0) &&
                                        <div className={styles.errorText}>유료 행사는 가격을 입력해야 합니다.</div>
                                    }
                                </>
                            }


                            <div className={`${styles.textRequired} mt16`}>
                                추천 대상
                            </div>
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

                            <div className={`${styles.textRequired} mt16`}>
                                장소
                            </div>
                            <RadioBtn option={{label: '오프라인', value: false, groupValue: isOnline}}
                                      onChange={(val) => setValue("isOnline", Boolean(val))}
                            />

                            <input {...register("locationText")}
                                   disabled={isOnline}
                                   className="input-default mt8" placeholder="장소를 입력해주세요"/>
                            {(errors.locationText && !isOnline) &&
                                <div className={styles.errorText}>{errors.locationText.message}</div>}

                            <RadioBtn
                                className="mt16"
                                option={{label: '온라인', value: true, groupValue: isOnline}}
                                onChange={(val) => {
                                    setValue("isOnline", Boolean(val));
                                    setValue("locationText", null);
                                }}
                            />

                            <input {...register("locationLink")}
                                   disabled={!isOnline}
                                   className="input-default mt8" placeholder="링크 (선택)"/>


                            <div className={`${styles.textRequired} ${styles.noneRequired} mt16`}>
                                신청링크
                            </div>
                            <input {...register("applyLink")}
                                   className="input-default" placeholder="https://medium.com/example-article"/>
                            {errors.applyLink && <div className={styles.errorText}>{errors.applyLink.message}</div>}

                            <div className={`${styles.textRequired} ${styles.noneRequired} mt16`}>
                                문의 방법
                            </div>
                            <input {...register("contact")}
                                   className="input-default" placeholder="문의방법을 입력해주세요."/>


                            <div className={`${styles.textRequired} ${styles.noneRequired} mt16`}>
                                행사 설명
                            </div>
                            <Controller
                                control={control}
                                name="description"
                                render={({field: {value, onChange,}}) => (
                                    <ReactQuill
                                        modules={modules}
                                        value={value ?? ""}
                                        onChange={onChange}
                                        theme="snow"
                                        placeholder="상세 내용을 입력해주세요."
                                        className="mt8"
                                        style={{height: '250px', marginBottom: '60px'}}
                                    />
                                )}
                            />


                            <div className={`${styles.textRequired} ${styles.noneRequired} mt16`}>
                                해시 태그
                            </div>
                            <input onKeyDown={addTags} type="text"
                                   className="input-default" placeholder="최대 5개 (ENTER)"
                                   disabled={hashTags.length >= 5}
                            />
                            <div className="box-flex gap8 mt16">
                                {hashTags.map((tag, index) => {
                                    return <button type={"button"} onClick={() => removeHashTag(index)}
                                                   className={styles.boxHashTag} key={index}>{tag}
                                        <span>X</span></button>
                                })}
                            </div>

                            {errors.hashTags && <div className={styles.errorText}>{errors.hashTags.message}</div>}

                        </div>

                    </div>
                    <div className="flex2">

                        <div className="container-default pa24">
                            <div className={styles.titleCard}>
                                관리
                            </div>
                            <button type="button" onClick={() => handleCreateSubmit()}
                                    className="btnDefault w100p mb12">등록하기
                            </button>
                            <button type="button" onClick={() => handleDraftSubmit()}
                                    className="btnBorder w100p">임시 저장
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
        ;
}
