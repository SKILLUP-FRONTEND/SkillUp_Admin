// schemas/bannerSchema.ts
import { z } from "zod";

export const bannerSchema = z.object({
    title: z
        .string()
        .min(1, "제목은 필수입니다.")
        .max(50, "제목은 50자 이하"),
});
