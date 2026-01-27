import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const queryString = searchParams.toString();

    const res = await serverFetch(`/articles/admin?${queryString}`);
    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
}
