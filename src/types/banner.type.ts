
export interface BannerModel {
    displayOrder: number;
    title: string;
    bannerImageUrl: string;
    bannerLink: string;

    startAt: string;
    endAt: string;

    bannerType: string;
    id:number
}

export interface BannerDetailModel {
    displayOrder: number;
    mainTitle: string;
    subTitle:string;
    description:string;
    bannerImageUrl: string;
    bannerLink: string;

    startAt: string;
    endAt: string;

    bannerType: string;
}


