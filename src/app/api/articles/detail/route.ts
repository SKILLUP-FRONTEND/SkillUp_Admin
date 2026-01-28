import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import client from "@/client/client";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);


    const articleId = searchParams.get('id');

    const res = await serverFetch(`/articles/${articleId}/admin`);
    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
}
