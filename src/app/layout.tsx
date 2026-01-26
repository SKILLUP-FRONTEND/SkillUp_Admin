/*
  담당자 : 김재혁
  최초 작성일 : 2025-08-21
  최종 수정일 : 2025-08-27
*/

import {ReactNode} from "react";
import "@/styles/global.scss";
import "@/styles/util.scss"
import GlobalLoading from "@/components/common/loading/GlobalLoading";
import GlobalModal from "@/components/common/modal/GlobalModal";


export const metadata = {
    title: "SkillUp Admin",
    description: "스킬업 어드민 웹페이지",
};

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="ko">
        <head>
            <link
                rel="stylesheet"
                as="style"
                crossOrigin="anonymous"
                href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
            />
        </head>
        <body>
        <GlobalLoading/>
        <GlobalModal/>
        {children}

        </body>
        </html>
    );
}
