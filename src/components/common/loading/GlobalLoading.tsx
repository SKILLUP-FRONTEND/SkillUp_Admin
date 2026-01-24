// src/components/common/GlobalLoading.tsx
"use client";

import { useLoadingStore } from "@/store/loadingStore";

export default function GlobalLoading() {
    const isLoading = useLoadingStore((s) => s.isLoading);

    if (!isLoading) return null;

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            color: "#fff"
        }}>
            로딩중...
        </div>
    );
}
