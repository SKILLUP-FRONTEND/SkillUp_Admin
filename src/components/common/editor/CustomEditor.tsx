// src/app/(admin)/banner/QuillEditor.tsx
"use client";

import React, {useEffect, useMemo} from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {uploadImg} from "@/api/client";
import Swal from "sweetalert2";
import {useLoadingStore} from "@/store/loadingStore";

interface Props {
    value: string;
    onChange: (content: string) => void;
    quillRef: React.RefObject<ReactQuill | null>;
    imageHandler: () => void;
}

export default function CustomEditor({value, onChange, quillRef, imageHandler}: Props) {
    const showLoading = useLoadingStore((s) => s.show);
    const hideLoading = useLoadingStore((s) => s.hide);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{header: [1, 2,3,4, false]}],
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
        const checkEditor = setInterval(() => {
            const editor = quillRef.current?.getEditor();
            if (editor) {
                const handlePaste = (e: ClipboardEvent) => {
                    const files = e.clipboardData?.files;
                    if (files && files.length > 0 && files[0].type.startsWith("image/")) {
                        e.preventDefault();
                        console.log("C+V 성공! 파일:", );
                        void uploadImage(files[0]);
                    }
                };

                editor.root.addEventListener("paste", handlePaste, true);
                clearInterval(checkEditor); // 등록 성공 시 인터벌 종료
            }
        }, 100); // 100ms마다 에디터 준비 상태 확인

        return () => clearInterval(checkEditor);
    }, [quillRef,value]);

    const uploadImage = async (file:File) =>  {


        try {
            showLoading();
            const response = await uploadImg(file);
            const imageUrl = response.data;
            const quill = quillRef.current?.getEditor();
            if (quill) {
                const range = quill.getSelection();
                quill.insertEmbed(range?.index || 0, 'image', imageUrl);
            }
        } catch (error) {
            Swal.fire('이미지 업로드 실패');
        } finally {
            hideLoading();
        }
    };

    return (
        <ReactQuill
            modules={modules}
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder="상세 내용을 입력해주세요."
            className="mt8"
            style={{height: "250px", marginBottom: "60px"}}
        />
    );
}