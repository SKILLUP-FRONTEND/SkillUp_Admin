import { cookies } from "next/headers";

export async function serverFetch(
    url: string,
    options: RequestInit = {},
    attachToken = true
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("userSession")?.value;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
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
