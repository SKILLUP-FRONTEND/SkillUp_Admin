// axios instance
import axios from "axios";
import {deleteCookie, getCookie} from 'cookies-next';


const instance = axios.create({
    baseURL: "https://52.79.215.19.nip.io",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const accessToken = getCookie('userSession');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            deleteCookie("userSession", { path: "/" });
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);



export default instance;


export const adminLogin = async (id: string, password: string) => {
    const response = await instance.post("/admin/login", {
        email: id,
        password: password,
    });
    return response.data;
};

export const getAllMembers = async (params:object) => {
    const response = await instance.get("/admin/users", {
        params: params
    });

    return response.data;
}

export const getArticle = async (params:object) => {
    const response = await instance.get("/articles/admin", {
        params: params
    });

    return response.data;
}