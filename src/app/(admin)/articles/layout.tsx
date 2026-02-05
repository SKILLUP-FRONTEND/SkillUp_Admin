import {ReactNode, Suspense} from "react";


export default function ArticleLayout({children}: { children: ReactNode }) {
    return (
        <Suspense>
            {children}
        </Suspense>
    );
}