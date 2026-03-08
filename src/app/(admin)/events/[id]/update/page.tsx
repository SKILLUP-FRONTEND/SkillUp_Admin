// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import React, {useEffect, useRef, useState} from "react";
import styles from "../../events.module.scss"

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

import {EventFormType, eventSchema} from "@/validators/event";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CheckboxGroup} from "@/components/common/checkbox/CheckboxGroup";
import {getEventDetail, updateEvent} from "@/api/client";

import {useLoadingStore} from "@/store/loadingStore";
import Swal from "sweetalert2";
import {useParams, useRouter} from "next/navigation";
import {RadioGroup} from "@/components/common/radio/RadioGroup";
import {RadioBtn} from "@/components/common/radio/RadioBtn";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Cropper, {Point} from "react-easy-crop";
import type {Area} from "react-easy-crop";
import {ALL_HASHTAGS} from "@/types/event.type";
import DaumPostcode from "react-daum-postcode";
import {Address} from "react-daum-postcode/lib/loadPostcode";
import Status = naver.maps.Service.Status;
import GeocodeResponse = naver.maps.Service.GeocodeResponse;

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,

});

export default function EventUpdatePage() {
    const params = useParams();
    const router = useRouter();
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

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
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    const mapRef = useRef<naver.maps.Map | null>(null);
    const markerRef = useRef<naver.maps.Marker | null>(null);

    const isOnlineRef = useRef(isOnline);


    const handleComplete = (data: Address) => {
        const fullAddress = data.address;

        setIsPostcodeOpen(false);
        setValue('locationText', fullAddress, {shouldValidate: true});

        if (window.naver && window.naver.maps.Service) {
            window.naver.maps.Service.geocode({
                query: fullAddress
            }, (status: Status, response: GeocodeResponse) => {
                if (status !== window.naver.maps.Service.Status.OK) return;

                const result = response.v2.addresses[0];
                const lat = parseFloat(result.y);
                const lng = parseFloat(result.x);
                const coords = new window.naver.maps.LatLng(lat, lng);

                setValue('latitude', lat);
                setValue('longitude', lng);

                if (mapRef.current && markerRef.current) {
                    mapRef.current.setCenter(coords);
                    mapRef.current.setZoom(16);
                    markerRef.current.setPosition(coords);
                }
            });
        }


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
    const targetRoles = watch("targetRoles");

    const initData = async () => {
        try {
            showLoading();
            const result = await getEventDetail({id: params.id});
            const data = result.data;
            setValue("title", data.title, {shouldValidate: true});
            setValue("category", data.category, {shouldValidate: true});
            setValue("eventStart", new Date(data.eventStart), {shouldValidate: true});
            setValue("eventEnd", new Date(data.eventEnd), {shouldValidate: true});
            setValue("recruitStart", data.recruitStart != null ? new Date(data.recruitStart) : null, {shouldValidate: true});
            setValue("recruitEnd", data.recruitEnd != null ? new Date(data.recruitEnd) : null, {shouldValidate: true});
            setValue("targetRoles", data.targetRoles, {shouldValidate: true});
            setValue('isFree', data.isFree, {shouldValidate: true});
            setValue('price', data.price, {shouldValidate: true});
            setValue('isOnline', data.isOnline, {shouldValidate: true});
            setValue('locationText', data.locationText, {shouldValidate: true});
            setValue('locationTextDetail', data.locationTextDetail, {shouldValidate: true});
            setValue('latitude', data.latitude, {shouldValidate: true});
            setValue('longitude', data.longitude, {shouldValidate: true});
            setValue('locationLink', data.locationLink, {shouldValidate: true});
            setValue('applyLink', data.applyLink, {shouldValidate: true});
            setValue('contact', data.contact, {shouldValidate: true});
            setValue('description', data.description, {shouldValidate: true});
            setValue('hashTags', data.hashTags, {shouldValidate: true});


            setPreview(data.thumbnailUrl);

        } catch (error) {
        } finally {
            hideLoading();
        }
    };

    const checkHashTag = (data: string) => {

        let nArray;
        if (hashTags.includes(data)) {
            nArray = hashTags.filter((innerData) => innerData !== data);
        } else {
            if (hashTags.length >= 5) {
                return;
            }else{
                nArray = [...hashTags, data];
            }
        }
        setValue("hashTags", nArray);
    }

    useEffect(() => {
        isOnlineRef.current = isOnline;

        // 이 부분은 지도 인터랙션을 제어하는 아주 좋은 코드입니다!
        if (mapRef.current) {
            mapRef.current.setOptions({
                clickable: !isOnline,
                draggable: !isOnline,
                scrollWheel: !isOnline
            });
        }
    }, [isOnline]);

    useEffect(() => {
        const initMap = () => {
            const mapOptions = {
                center: new naver.maps.LatLng(37.3595704, 127.105399),
                zoom: 10,
            };

            const map = new naver.maps.Map('map', mapOptions);

            const marker = new naver.maps.Marker({
                position: mapOptions.center,
                map: map
            });

            // Ref에 인스턴스 보관 (외부 함수에서 쓰기 위해)
            mapRef.current = map;
            markerRef.current = marker;

            naver.maps.Event.addListener(map, 'click', function (e) {
                if (isOnlineRef.current) {
                    return;
                }
                const latlng = e.coord;
                marker.setPosition(latlng);

                setValue('latitude', latlng.y, {shouldValidate: true});
                setValue('longitude', latlng.x, {shouldValidate: true});

                if (naver.maps.Service && naver.maps.Service.reverseGeocode) {
                    naver.maps.Service.reverseGeocode({
                        coords: latlng,
                        orders: [
                            naver.maps.Service.OrderType.ADDR,
                            naver.maps.Service.OrderType.ROAD_ADDR
                        ].join(',')
                    }, function (status, response) {
                        console.log(status, response);
                        if (status !== naver.maps.Service.Status.OK) {
                            return alert('주소 변환에 실패했습니다.');
                        }
                        const items = response.v2.results;
                        const address = items[0].region.area1.name + " " +
                            items[0].region.area2.name + " " +
                            items[0].region.area3.name + " " +
                            items[0].land.number1;

                        setValue('locationText', address, {shouldValidate: true});

                    });
                }
            });


        };

        if (window.naver && window.naver.maps) {
            initMap();
        } else {
            const mapScript = document.createElement('script');
            mapScript.onload = () => initMap();
            mapScript.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=hb9lyolgnv?submodules=geocoder`;
            document.head.appendChild(mapScript);
        }
    }, []);

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
                                {
                                    imageSrc ?
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
                                        ) :
                                        preview ? (
                                                <img src={preview} alt="preview" className={styles.previewImg}/>
                                            ) :
                                            (
                                                <div className={styles.uploadLabel}>
                                                    이미지 업로드
                                                </div>
                                            )
                                }
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
                                <div className={styles.errorText}>
                                    행사 기간은 필수입니다.</div>}

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
                                            maxDate={recruitEnd != null ? recruitEnd : undefined}
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
                                            minDate={recruitStart != null ? recruitStart : undefined}
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


                            <div className="box-flex mb16">
                                <RadioBtn option={{label: '오프라인', value: false, groupValue: isOnline}}
                                          className="mr-auto"
                                          onChange={(val) => setValue("isOnline", Boolean(val))}
                                />
                                <button className="btnDefault mr10" type={"button"}
                                        disabled={isOnline}
                                        onClick={() => setIsPostcodeOpen(true)}>주소검색
                                </button>
                            </div>

                            <div id="map" style={{width: '100%', height: '500px'}}></div>


                            <input {...register("locationText")}
                                   disabled={isOnline}
                                   readOnly={true}
                                   className="input-default mt8" placeholder="장소를 입력해주세요"/>
                            {(errors.locationText && !isOnline) &&
                                <div className={styles.errorText}>{errors.locationText.message}</div>}

                            <input {...register("locationTextDetail")}
                                   disabled={isOnline}
                                   className="input-default mt8" placeholder="장소(상세)를 입력해주세요"/>
                            {(errors.locationTextDetail && !isOnline) &&
                                <div className={styles.errorText}>{errors.locationTextDetail.message}</div>}

                            <RadioBtn
                                className="mt16"
                                option={{label: '온라인', value: true, groupValue: isOnline}}
                                onChange={(val) => {
                                    setValue("isOnline", Boolean(val));
                                    setValue("locationText", null);
                                    setValue("locationTextDetail", null);
                                    setValue("latitude", null);
                                    setValue("longitude", null);
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

                            <div className="box-flex gap8 mt16 fw-wrap">
                                {ALL_HASHTAGS.map((tag, index) => {
                                    return <button type={"button"} onClick={() => checkHashTag(tag)}
                                                   className={`${styles.boxHashTag} ${hashTags.includes(tag) ? styles.active : ''} `}
                                                   key={index}>{tag}
                                    </button>
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
                                    className="btnDefault w100p mb12">수정완료
                            </button>
                            <button type="button" onClick={() => router.back()}
                                    className="btnBorder w100p">수정취소
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {isPostcodeOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        width: '500px', background: '#fff', padding: '20px', borderRadius: '8px',
                        position: 'relative'
                    }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                            <h3 style={{margin: 0}}>주소 검색</h3>
                            <button onClick={() => setIsPostcodeOpen(false)}>닫기</button>
                        </div>
                        <DaumPostcode
                            onComplete={handleComplete}
                            autoClose={false}
                        />
                    </div>
                </div>
            )}
        </>
    )
        ;
}
