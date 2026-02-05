import {ReactNode, Suspense} from "react";


export default function EventLayout({children}: { children: ReactNode }) {
    return (
        <Suspense>
            {children}
        </Suspense>
    );
}