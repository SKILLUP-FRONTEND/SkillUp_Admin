// components/common/GlobalModal.tsx
"use client";
import { useModalStore } from "@/store/modalStore";

export default function GlobalModal() {
    const { modal, closeModal } = useModalStore();

    if (!modal) return null;

    return (
        <div className="modal-backdrop" onClick={closeModal}
             style={{
                 position: "fixed",
                 inset: 0,
                 background: "rgba(0,0,0,0.4)",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 zIndex: 1000,
                 color: "#fff"
             }}
        >


            <div onClick={(e) => e.stopPropagation()}>
                {modal}
            </div>
        </div>
    );
}
