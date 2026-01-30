'use api';

import { deleteCookie,  setCookie } from 'cookies-next';

export function setAuthSession(userToken: string, autoLogin: boolean) {
    setCookie('userSession', userToken, {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        ...(autoLogin ? { maxAge: 60 * 60 * 24 * 30 } : {}),
    });
}

export function removeAuthSession() {
    deleteCookie('userSession', {
        path: '/',
    });
}

