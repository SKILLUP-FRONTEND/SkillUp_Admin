import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";

export async function GET(req: NextRequest) {
    const res = await serverFetch(`/events/admin/drafts`);
    const text = await res.text();
    let data: unknown;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { message: "Invalid JSON from server", raw: text };
    }
    return NextResponse.json(data, { status: res.status });
}
