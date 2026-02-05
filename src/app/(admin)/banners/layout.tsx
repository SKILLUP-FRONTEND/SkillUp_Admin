import {ReactNode, Suspense} from "react";


export default function BannerLayout({children}: { children: ReactNode }) {
    return (
        <Suspense>
            {children}
        </Suspense>
    );
}