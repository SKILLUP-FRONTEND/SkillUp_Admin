// app/actions/auth.ts
'use server';

import {cookies} from 'next/headers';

export async function setAuthSession(userToken: string, autoLogin: boolean) {
    const cookieStore = await cookies();
    cookieStore.set('userSession', JSON.stringify(userToken), {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        ...(autoLogin
            ? {maxAge: 60 * 60 * 24 * 30}
            : {}),
    });
}

export async function removeAuthSession() {
    const cookieStore = await cookies();

    cookieStore.delete('userSession');
}