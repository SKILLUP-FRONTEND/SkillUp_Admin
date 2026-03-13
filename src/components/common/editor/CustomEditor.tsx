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
        // 1. 이벤트 핸들러 선언
        const handlePaste = (e: ClipboardEvent) => {
            const clipboardData = e.clipboardData;
            if (clipboardData && clipboardData.files && clipboardData.files.length > 0) {
                const file = clipboardData.files[0];
                if (file.type.startsWith("image/")) {
                    e.preventDefault(); // 기본 바이너리 삽입 중단
                    e.stopImmediatePropagation(); // 다른 핸들러로의 전파 중단 (중요!)
                    void uploadImage(file);
                }
            }
        };

        const checkEditor = setInterval(() => {
            const editor = quillRef.current?.getEditor();
            if (editor) {
                // 2. 등록 전 기존 리스너 제거 (중복 방지 안전장치)
                editor.root.removeEventListener("paste", handlePaste, true);
                // 3. 캡처링 단계에서 리스너 등록
                editor.root.addEventListener("paste", handlePaste, true);
                clearInterval(checkEditor);
            }
        }, 100);

        return () => {
            clearInterval(checkEditor);
            const editor = quillRef.current?.getEditor();
            if (editor) {
                editor.root.removeEventListener("paste", handlePaste, true);
            }
        };
        // ⚠️ 의존성 배열에서 value를 제거했습니다. quillRef만 있으면 됩니다.
    }, [quillRef, uploadImage]);

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