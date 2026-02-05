import {NextRequest, NextResponse} from "next/server";
import {serverFetch} from "@/lib/serverFetch";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const params = {
        email: body.id,
        password: body.password,
    }
    const autoLogin = body.autoLogin;
    const res = await serverFetch(
        "/admin/login",
        {
            method: "POST",
            body: JSON.stringify(params),
        },
        false
    );
    const data = await res.json();

    const response = NextResponse.json(data);

    if (data?.data?.accessToken) {
        const cookieOptions: object = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // 로컬에선 false여야 쿠키 보임
            sameSite: "lax",
            path: "/",
            ...autoLogin? {maxAge :  60 * 60 * 24 * 30} : {},
        };
        response.cookies.set("userSession", data.data.accessToken, cookieOptions);
    }


    return response;
}
