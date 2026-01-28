import {cookies} from "next/headers";

export async function serverFetch(
    url: string,
    options: RequestInit = {},
    attachToken = true
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("userSession")?.value;

    const isFormData = options.body instanceof FormData;

    console.log(token)

    const headers: Record<string, string> = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers as Record<string, string> || {}),
    };

    if (attachToken && token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`https://52.79.215.19.nip.io${url}`, {
        ...options,
        headers,
        cache: "no-store",
    });
}
