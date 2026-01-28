import {z} from "zod";

export const articleSchema = z.object({
    title: z
        .string()
        .min(1, "제목은 필수입니다.")
        .max(100, "제목은 100자 이하"),

    originalUrl: z
        .string()
        .min(1, "원문 링크는 필수입니다.")
        .url("올바른 URL 형식이 아닙니다."),

    summary: z
        .string()
        .min(1, "요약은 필수입니다.")
        .max(30, "요약은 30자 이하"),


    source: z
        .string()
        .min(1, "출처는 필수입니다."),

    originalPublishedDate: z
        .string()
        .min(1, "원문 게시일은 필수입니다."),


    targetRoles: z.array(z.string()).min(1, "직군을 최소 1개 선택해주세요."),

    status : z.string(),

});

export type ArticleFormType = z.infer<typeof articleSchema>;
