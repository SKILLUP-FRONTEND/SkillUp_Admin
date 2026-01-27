import {NextRequest, NextResponse} from "next/server";
import {serverFetch} from "@/lib/serverFetch";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const res = await serverFetch(
        "/admin/login",
        {
            method: "POST",
            body: JSON.stringify(body),
        },
        false
    );

    const data = await res.json();
    const response = NextResponse.json(data);

    if (data?.data?.accessToken) {
        response.cookies.set("userSession", data.data.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
        });
    }

    return response;
}
