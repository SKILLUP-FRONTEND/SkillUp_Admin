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
    locationTextDetail: string;
    locationLink: string;
    latitude: number;
    longitude: number;
    applyLink: string;
    contact:string;
    targetRoles: Array<string>;

    description: string;
    hashTags: Array<string>;

    status: EventStatus;

}

export const EVENT_HASHTAGS = {
    ROLES: [
        "#기획자", "#서비스기획자", "#프로덕트매니저", "#프로덕트오너", "#디자이너", "#UI디자이너", "#UX디자이너", "#브랜딩디자이너", "#그래픽디자이너", "#개발자", "#프론트엔드개발자", "#백엔드개발자", "#데이터엔지니어", "#데이터분석가", "#AI엔지니어", "#마케터", "#퍼포먼스마케터", "#콘텐츠마케터", "#CX전문가", "#리서처", "#PM", "#PO"
    ],
    EVENT_TYPES: [
        "#컨퍼런스", "#세미나", "#웨비나", "#워크숍", "#부트캠프", "#해커톤", "#공모전", "#멘토링", "#네트워킹", "#스터디", "#세션", "#페스티벌", "#데모데이", "#교육프로그램", "#기업설명회"
    ],
    TECH_STACK: [
        "#AI", "#인공지능", "#머신러닝", "#딥러닝", "#데이터분석", "#데이터시각화", "#파이썬", "#R언어", "#SQL", "#TensorFlow", "#PyTorch", "#클라우드", "#AWS", "#GCP", "#Azure", "#서버리스", "#MLOps", "#노코드", "#로우코드", "#Flutter", "#React", "#NextJS", "#Figma", "#Notion", "#Slack", "#Jira", "#GitHub", "#GA4", "#Amplitude"
    ],
    TOPICS: [
        "#서비스기획", "#UX리서치", "#UX전략", "#UI디자인", "#프로덕트디자인", "#서비스운영", "#서비스전략", "#사용자경험", "#고객여정맵", "#브랜드전략", "#디자인시스템", "#비즈니스모델", "#업무자동화", "#AI활용", "#마케팅전략", "#그로스해킹", "#콘텐츠기획", "#프로젝트관리", "#애자일", "#OKR", "#로드맵수립"
    ],
    CAREER: [
        "#취업준비", "#이직준비", "#커리어성장", "#사이드프로젝트", "#포트폴리오", "#실무역량강화", "#인사이트공유", "#직무전환", "#리더십개발", "#개발입문", "#디자인입문", "#기획입문", "#데이터입문", "#AI입문", "#업무스킬업", "#스터디모임", "#취준생", "#주니어"
    ],
    LOCATION: [
        "#서울", "#판교", "#부산", "#강남", "#대구", "#광주", "#대전", "#춘천", "#제주", "#인천", "#온라인", "#오프라인", "#코엑스", "#DDP", "#킨텍스"
    ]
} as const;


export const ALL_HASHTAGS = Object.values(EVENT_HASHTAGS).flat();
