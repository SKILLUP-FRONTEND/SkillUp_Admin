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
        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    // 이미지가 확인되면 브라우저 기본 동작 즉시 중단
                    e.preventDefault();
                    e.stopPropagation();

                    const file = items[i].getAsFile();
                    if (file) {
                        void uploadImage(file);
                    }
                    return; // 이미지 하나 처리하면 종료
                }
            }
        };

        // 'true'를 주어 캡처링 단계에서 먼저 가로채고,
        // root뿐만 아니라 에디터 전체 영역에 대해 감시할 수 있도록 합니다.
        const node = editor.root;
        node.addEventListener("paste", handlePaste, true);

        return () => {
            node.removeEventListener("paste", handlePaste, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quillRef.current, uploadImage]);
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