import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData(); // Web FormData 그대로

        const res = await serverFetch("/events/home/admin/banners", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        return NextResponse.json({ message: "업로드 실패" }, { status: 500 });
    }
}
