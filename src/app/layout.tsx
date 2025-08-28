/* 
  담당자 : 김재혁
  최초 작성일 : 2025-08-21
  최종 수정일 : 2025-08-27
*/

import { ReactNode } from "react";
import "../styles/global.css";

export const metadata = {
  title: "Skill Up User Front",
  description: "스킬업 웹페이지 구축 프로젝트",
};

export default function RootLayout({ children }: { children: ReactNode }) {
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
      <body>{children}</body>
    </html>
  );
}
