import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";

export async function PUT(req: NextRequest) {
    try {
        const formData = await req.formData();
        const { searchParams } = new URL(req.url);
        const articleId = searchParams.get("id");
        console.log(articleId)

        const res = await serverFetch(`/articles/${articleId}/admin`, {
            method: "PUT",
            body: formData,
        });

        console.log(res)

        const data = await res.json();
        console.log(data)
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        return NextResponse.json({ message: "업로드 실패" }, { status: 500 });
    }
}
