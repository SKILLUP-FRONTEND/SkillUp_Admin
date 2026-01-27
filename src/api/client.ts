// src/api/client.ts
import axios from "axios";

const client = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});


client.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            fetch("/api/logout", {method: "POST"}).then();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default client;

export const login =async (email: string, password: string) =>{
    const response = await client.post("/login", {email, password});
    return response.data;
}


export const getAllMembers = async (params: object) => {
    const response = await client.get("/members", {
        params: params
    });

    return response.data;
}

export const getArticle = async (params: object) => {
    const response = await client.get("/articles", {
        params: params
    });

    return response.data;
}