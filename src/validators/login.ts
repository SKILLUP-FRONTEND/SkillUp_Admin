import {z} from "zod";

export const loginSchema = z.object({
    id: z
        .string()
        .min(1, "아이디를 입력해주세요.")
        .email("이메일 형식으로 입력해주세요."),

    password: z
        .string()
        .min(1, "비밀번호를 입력해주세요."),


});

export type LoginFormType = z.infer<typeof loginSchema>;
