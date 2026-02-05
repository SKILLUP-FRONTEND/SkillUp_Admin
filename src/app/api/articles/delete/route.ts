import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("articleId");
    const res = await serverFetch(`/articles/${articleId}/admin`,{
        method: "DELETE"
    });
    const text = await res.text();
    let data: unknown;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { message: "Invalid JSON from server", raw: text };
    }

    return NextResponse.json(data, { status: res.status });
}
