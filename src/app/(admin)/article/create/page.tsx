// src/app/(admin)/banner/page.tsx
/* 
  담당자 : 
  최초 작성일 : 2025-08-28
  최종 수정일 : 2025-08-28
*/
"use client";

import styles from "../article.module.scss"
import {useState} from "react";


export default function ArticleCreatePage() {
    const [data, setData] = useState([]);
    return (
        <>
            <div className="title-page mb32">
                아티클 등록
            </div>
            <div className="box-flex gap24 a-start">
                <div className="fg3">
                    <div className="container-default mb24 pa24">
                        <div className={styles.titleCard}>
                            기본 정보
                        </div>
                        <div className={styles.textRequired}>
                            제목
                        </div>
                        <input className="input-default" placeholder="디자인 시스템 구축을 위한 실전 가이드"/>
                        <div>
                            요약
                        </div>
                        <textarea />
                        <div>
                            출처
                        </div>
                        <input/>

                    </div>
                    <div className="container-default pa24">11</div>
                </div>
                <div className="fg2">
                    <div className="container-default pa24 mb24">22</div>
                    <div className="container-default pa24">22</div>
                </div>

            </div>
        </>
    );
}
