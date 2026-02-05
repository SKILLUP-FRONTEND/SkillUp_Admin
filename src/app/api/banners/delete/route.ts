import {NextRequest, NextResponse} from "next/server";
import {serverFetch} from "@/lib/serverFetch";

export async function DELETE(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const bannerId = searchParams.get("bannerId");
    const res = await serverFetch(`/events/home/banners/${bannerId}`, {
        method: "DELETE"
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
