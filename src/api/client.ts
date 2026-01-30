import axios from "axios";
import {ArticleFormType} from "@/validators/article";

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

export const adminLogin = async (params: object) => {
    const response = await client.post("/login", params);
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

export const getArticleDetail = async (params: object) => {
    const response = await client.get("/articles/detail", {
        params: params
    });

    return response.data;
}


export const createArticle = async (params: ArticleFormType, file?: File | null) => {

    const formData = new FormData();


    formData.append("request", JSON.stringify(params));
    if (file) {
        formData.append("thumbnailImage", file);
    }

    const response = await client.post("/articles/create", formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const updateArticle = async (params: ArticleFormType,  id:string,file?: File | null,) => {

    const formData = new FormData();

    formData.append("request", JSON.stringify(params));
    if (file) {
        formData.append("thumbnailImage", file);
    }

    const response = await client.put(`/articles/update?id=${id}`, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const deleteArticle = async (id: number) => {
    const response = await client.delete("/articles/delete", {
        params: {articleId:id}
    });

    return response.data;
}

