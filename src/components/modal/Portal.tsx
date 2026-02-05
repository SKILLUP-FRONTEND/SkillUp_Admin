"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useModalStore } from "@/store/modalStore";

export default function Portal() {
    const { isOpen, content, closeModal } = useModalStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isOpen || !content) return null;

    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return null;

    return createPortal(
        <div className="containerModal" onClick={closeModal}>
            <div className="wrapperModal" onClick={(e) => e.stopPropagation()}>
                {content}
            </div>
        </div>,
        modalRoot
    );
}