import {NextRequest, NextResponse} from "next/server";
import {serverFetch} from "@/lib/serverFetch";

export async function PATCH(req: NextRequest) {
    const body = await req.json();

    const res = await serverFetch(`/events/home/admin/banners/order`, {
        method: "PATCH",

        body: JSON.stringify(body),
    });
    const text = await res.text();
    let data: unknown;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = {message: "Invalid JSON from server", raw: text};
    }

    return NextResponse.json(data, {status: res.status});
}
