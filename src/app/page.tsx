/* 
  작성자 : 김재혁
  작성일 : 2025-08-21
  최종 수정일 : 2025-08-27
*/

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div id="wrap">
      <p id="skipNav" className="hide">
        <a href="/">본문 바로가기</a>
      </p>
      <Header/>

      <section id="container" className="main">
        <div className="content">
          <div className="home one"></div>
          <div className="home two"></div>
          <div className="home three"></div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
