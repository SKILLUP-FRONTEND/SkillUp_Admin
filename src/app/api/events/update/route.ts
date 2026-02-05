import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";

export async function PUT(req: NextRequest) {
    try {
        const formData = await req.formData();
        const { searchParams } = new URL(req.url);
        const eventId = searchParams.get("id");

        const res = await serverFetch(`/events/${eventId}`, {
            method: "PUT",
            body: formData,
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        return NextResponse.json({ message: "업로드 실패" }, { status: 500 });
    }
}
