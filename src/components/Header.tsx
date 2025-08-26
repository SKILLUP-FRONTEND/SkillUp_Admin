/* 
  작성자 : 김재혁
  작성일 : 2025-08-21
  최종 수정일 : 2025-08-21
*/

import Link from "next/link";

export default function Header() {
  return (
    <header id="header">
      <div className="inner">
        <h1>Skill Up</h1>
        <nav>
          <ul className="gnb">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/login">로그인</Link></li>
            <li><Link href="/signup">회원가입</Link></li>
            <li><Link href="/admin">관리자페이지</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}