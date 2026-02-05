// src/types/event.type.ts

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/

import {ArticleStatus} from "@/types/article.type";

export type EventStatus =
    | "RECRUITING"
    | "RECRUITING_EXPECTED"
    | "RECRUITING_CLOSED"
    | "ENDED";

export interface EventModel {
    id: number;
    title: string;
    category: string;
    period: string;
    views: number;
    likes: number;
    status: EventStatus;
    createdAt: string;
}

export interface EventDraftModel {
    id: number;
    title: string;
    eventPeriodText: string;
    eventRecruitEnd: string;
    createdAt: string;


}

export interface EventDetailModel {
    id: number;
    title: string;
    thumbnailUrl: string;
    category: string;
    eventStart: Date;
    eventEnd: Date;
    recruitStart: Date;
    recruitEnd: Date;
    isFree: boolean;
    price: number;
    isOnline: boolean;
    locationText: string;
    locationLink: string;
    latitude: number;
    longitude: number;
    applyLink: string;
    targetRoles: Array<string>;

    description: string;
    hashTags: Array<string>;

    status: EventStatus;

}
