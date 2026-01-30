import {z} from "zod";

export const bannerSchema = z.object({
    title: z
        .string()
        .min(1, "배너명 필수입니다."),


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
