import axios from "axios";
import {ArticleFormType} from "@/validators/article";
import {BannerFormType} from "@/validators/banner";
import {EventFormType} from "@/validators/event";

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


//FOR AUTH
export const adminLogin = async (params: object) => {
    const response = await client.post("/login", params);
    return response.data;
}


//FOR MEMBER
export const getAllMembers = async (params: object) => {
    const response = await client.get("/members", {
        params: params
    });

    return response.data;
}

export const getMemberDetail = async (params: object) => {
    const response = await client.get("/members/detail", {
        params: params
    });

    return response.data;
}

//FOR ARTICLE
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

export const updateArticle = async (params: ArticleFormType, id: string, file?: File | null,) => {

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
        params: {articleId: id}
    });

    return response.data;
}


//FOR BANNER
export const getBanner = async (params: object) => {
    const response = await client.get("/banners", {
        params: params
    });
    return response.data;
}


export const getBannerDetail = async (params: object) => {
    const response = await client.get("/banners/detail", {
        params: params
    });

    return response.data;
}

export const createBanner = async (params: object, file?: File | null) => {

    const formData = new FormData();


    formData.append("request", JSON.stringify(params));
    if (file) {
        formData.append("bannerImage", file);
    }

    const response = await client.post("/banners/create", formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};


export const updateBanner = async (params: object, id: string, file?: File | null,) => {

    const formData = new FormData();

    formData.append("request", JSON.stringify(params));
    if (file) {
        formData.append("bannerImage", file);
    }

    const response = await client.put(`/banners/update?id=${id}`, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const deleteBanner = async (id: number) => {
    const response = await client.delete("/banners/delete", {
        params: {bannerId: id}
    });

    return response.data;
}


export const updateBannerOrder = async (params: object) => {
    const response = await client.patch("/banners/order", params);
    return response.data;
}


//FOR EVENTS
export const getEvents = async (params: object) => {
    const response = await client.get("/events", {
        params: params
    });
    return response.data;
}

export const getDraftEvents = async (params: object) => {
    const response = await client.get("/events/draft", {
        params: params
    });
    return response.data;
}


export const createEvent = async (params: EventFormType, file?: File | null) => {

    const formData = new FormData();


    formData.append("request", JSON.stringify(params));
    if (file) {
        formData.append("thumbnailImage", file);
    }

    const response = await client.post("/events/create", formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};


export const getEventDetail = async (params: object) => {
    const response = await client.get("/events/detail", {
        params: params
    });

    return response.data;
}


export const updateEvent = async (params: EventFormType, id: string, file?: File | null,) => {

    const formData = new FormData();

    formData.append("request", JSON.stringify(params));
    if (file) {
        formData.append("thumbnailImage", file);
    }

    const response = await client.put(`/events/update?id=${id}`, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};


export const deleteEvent = async (id: number) => {
    const response = await client.delete("/events/delete", {
        params: {eventId: id}
    });

    return response.data;
}

export const deleteDraftEvent = async (params:object) => {
    const response = await client.delete("/events/delete", {
        params: params
    });

    return response.data;
}


