import {z} from "zod";

export const bannerSchema = z.object({
    subTitle: z
        .string()
        .min(1, "서브 아이틀은 필수입니다."),

    mainTitle: z
        .string()
        .min(1, "메인 타이틀은 필수입니다."),

    description: z
        .string()
        .min(1, "설명은 필수입니다."),


    bannerLink: z
        .string()
        .min(1, "원문 링크는 필수입니다.")
        .url("올바른 URL 형식이 아닙니다."),


    bannerStart: z
        .date(),


    bannerEnd: z
        .date(),
});

export type BannerFormType = z.infer<typeof bannerSchema>;
