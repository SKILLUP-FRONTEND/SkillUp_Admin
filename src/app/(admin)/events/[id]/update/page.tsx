// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import React, {useEffect, useState} from "react";
import styles from "../../events.module.scss"

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

import {EventFormType, eventSchema} from "@/validators/event";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CheckboxGroup} from "@/components/common/checkbox/CheckboxGroup";
import {getEventDetail,  updateEvent} from "@/api/client";

import {useLoadingStore} from "@/store/loadingStore";
import Swal from "sweetalert2";
import {useParams, useRouter} from "next/navigation";
import {RadioGroup} from "@/components/common/radio/RadioGroup";
import {RadioBtn} from "@/components/common/radio/RadioBtn";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,

});

export default function EventUpdatePage() {
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
        formState: {errors},
    } = useForm<EventFormType>({
        resolver: zodResolver(eventSchema),
        mode: "onChange",
        defaultValues: {
            category: 'CONFERENCE_SEMINAR',
            targetRoles: [],
            draft: false,
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

    const handleActionSubmit = async () => {
        await handleSubmit(
            onSubmit,
            (errors) => {
                console.log("❌ 검증 실패", errors);
            }
        )();
    }

    const onSubmit = async (data: EventFormType) => {

        showLoading();
        try {
            const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
            const response = await updateEvent(data, eventId!, thumbnail,);
            if (response.code == "SUCCESS") {
                Swal.fire({
                    title: '수정되었습니다',
                    confirmButtonText: '확인',
                }).then();
                router.back();
            } else {
                Swal.fire({
                    title: '수정에 실패했습니다',
                    confirmButtonText: '확인',
                }).then();
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: '수정에 실패했습니다',
                confirmButtonText: '확인',
            }).then();
        } finally {
            hideLoading();
        }
    };
    const targetRoles = watch("targetRoles");

    const initData = async () => {
        try {
            showLoading();
            const result = await getEventDetail({id: params.id});
            const data = result.data;
            setValue("title", data.title, {shouldValidate: true});
            setValue("category", data.category, {shouldValidate: true});
            setValue("eventStart", new Date(data.eventStart) , {shouldValidate: true});
            setValue("eventEnd", new Date(data.eventEnd), {shouldValidate: true});
            setValue("recruitStart", new Date(data.recruitStart), {shouldValidate: true});
            setValue("recruitEnd",new Date(data.recruitEnd), {shouldValidate: true});
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


            setPreview(data.thumbnailUrl);

        } catch (error) {
            console.log(error);
        } finally {
            hideLoading();
        }
    };

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
                setValue("hashTags", nArray);
                e.currentTarget.value = "";
            }
        }
    }

    const removeHashTag = (index: number) => {
        const nArray = hashTags.filter((_, i) => i !== index);
        setValue("hashTags", nArray);
    }


    useEffect(() => {
        initData().then();
    }, []);

    return (
        <>
            <div className="title-page mb32">
                행사 수정
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="box-flex gap24 a-start">
                    <div className="flex3">
                        <div className="container-default mb24 pa24">


                            <div className={styles.textRequired}>
                                행사명
                            </div>
                            <input  {...register("title")} maxLength={20} className="input-default"
                                    placeholder="최대 100글자"/>
                            {errors.title && <div className={styles.errorText}>{errors.title.message}</div>}


                            <div className={`${styles.textRequired} ${styles.noneRequired} mt16`}>
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
                                            filterDate={(date) => date.getDay() !== 0} // 일요일 비활성화 예시
                                            className="input-default"
                                            maxDate={eventEnd}
                                            minDate={new Date()}
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
                                <div className={styles.errorText}>
                                    행사 기간은 필수입니다.</div>}

                            <div className={`${styles.textRequired} mt16`}>
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
                                            maxDate={recruitEnd}
                                            className="input-default"
                                            minDate={new Date()}
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
                                            minDate={recruitStart}


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
                            {(errors.recruitStart || errors.recruitEnd) &&
                                <div className={styles.errorText}>모집 기간은 필수입니다.</div>}


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
