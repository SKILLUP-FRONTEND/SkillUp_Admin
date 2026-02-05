import {z} from "zod";


export const eventSchema = z.object({
    title: z
        .string().min(1,'행사명은 필수입니다.'),
    category: z.string(),

    eventStart: z.date(),
    eventEnd: z.date(),
    recruitStart: z.date(),
    recruitEnd: z.date(),
    targetRoles:z.array(z.string()).min(1, "직군을 최소 1개 선택해주세요."),
    isFree: z.boolean(),
    price: z.number().or(z.nan()).or(z.undefined()),
    isOnline: z.boolean(),
    locationText: z.string().default("").nullish(),
    locationLink: z.string().nullish(),
    applyLink: z.string().nullish(),

    contact: z.string().nullish(),
    description: z.string().nullish(),
    hashTags: z.array(z.string()),
    draft: z.boolean(),


}).refine((data) => {
    if (!data.isFree && (!data.price || data.price <= 0)) {
        return false;
    }
    return true;
}, {
    message: "유료 행사는 가격을 입력해야 합니다.",
    path: ["price"],
}).refine((data) => {
    if (!data.isOnline && (!data.locationText || data.locationText.trim() === "")) {
        return false;
    }
    return true;
}, {
    message: "장소를 입력해주세요",
    path: ["locationText"],
}).refine((data) => {
    if (data.applyLink && data.applyLink.trim() !== "") {
        const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
        return urlRegex.test(data.applyLink);
    }
    return true;
}, {
    message: "올바른 URL 형식이 아닙니다.",
    path: ["applyLink"],
});

export type EventFormType = z.infer<typeof eventSchema>;
