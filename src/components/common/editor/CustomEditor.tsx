"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { uploadImg } from "@/api/client";
import Swal from "sweetalert2";
import { useLoadingStore } from "@/store/loadingStore";

interface Props {
    value: string;
    onChange: (content: string) => void;
    quillRef: React.RefObject<ReactQuill | null>;
    imageHandler: () => void;
}

export default function CustomEditor({ value, onChange, quillRef, imageHandler }: Props) {
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    // 이미지 업로드 로직 메모이제이션 (중복 생성 방지)
    const uploadImage = useCallback(async (file: File) => {
        try {
            showLoading();
            const response = await uploadImg(file);
            const imageUrl = response.data;
            const quill = quillRef.current?.getEditor();
            if (quill) {
                const range = quill.getSelection();
                // 커서 위치가 없으면 맨 마지막에 삽입
                const index = range ? range.index : quill.getLength();
                quill.insertEmbed(index, 'image', imageUrl);
                // 삽입 후 커서를 이미지 다음으로 이동
                quill.setSelection(index + 1, 0);
            }
        } catch (error) {
            Swal.fire('이미지 업로드 실패');
        } finally {
            hideLoading();
        }
    }, [showLoading, hideLoading, quillRef]);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, false] }],
                ["bold", "italic", "underline", "strike"],
                ["image", "link"],
                ["clean"],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), [imageHandler]);

    useEffect(() => {
        // 핸들러 선언 (메모리 누수 방지를 위해 내부에 선언하거나 useCallback 권장)
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const file = items[i].getAsFile();
                    if (file) void uploadImage(file);
                    return;
                }
            }
        };

        const checkEditor = setInterval(() => {
            try {
                // 1. Ref가 존재하는지 먼저 확인
                if (!quillRef.current) return;

                // 2. getEditor() 호출 시도 (여기서 에러가 발생하므로 try로 감쌈)
                const editor = quillRef.current.getEditor();

                if (editor && editor.root) {
                    editor.root.removeEventListener("paste", handlePaste, true);
                    editor.root.addEventListener("paste", handlePaste, true);
                    clearInterval(checkEditor); // 성공하면 인터벌 종료
                }
            } catch (e) {
                // 아직 에디터가 준비 안 됨 (Accessing non-instantiated editor)
                // 무시하고 다음 인터벌을 기다림
            }
        }, 200);

        return () => {
            clearInterval(checkEditor);
            try {
                const editor = quillRef.current?.getEditor();
                if (editor) {
                    editor.root.removeEventListener("paste", handlePaste, true);
                }
            } catch (e) {
                // 종료 시 에러 무시
            }
        };
    }, [quillRef, uploadImage]);
// ↑ quillRef.current 자체가 설정되었을 때 리스너를 붙이도록 변경

    return (
        <ReactQuill
            modules={modules}
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder="상세 내용을 입력해주세요."
            className="mt8"
            style={{ height: "250px", marginBottom: "60px" }} // 높이 살짝 조절
        />
    );
}