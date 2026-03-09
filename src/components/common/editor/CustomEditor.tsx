// src/app/(admin)/banner/QuillEditor.tsx
"use client";

import React, {useMemo} from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface Props {
    value: string;
    onChange: (content: string) => void;
    quillRef: React.RefObject<ReactQuill | null>;
    imageHandler: () => void;
}

export default function CustomEditor({value, onChange, quillRef, imageHandler}: Props) {
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{header: [1, 2, false]}],
                ["bold", "italic", "underline", "strike"],
                ["image", "link"],
                ["clean"],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), [imageHandler]);

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