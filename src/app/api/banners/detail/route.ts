import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const bannerId = searchParams.get('id');

    const res = await serverFetch(`/events/home/admin/banners/${bannerId}`);
    const text = await res.text();
    let data: unknown;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { message: "Invalid JSON from server", raw: text };
    }
    return NextResponse.json(data, { status: res.status });
}
