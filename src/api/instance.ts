// axios instance
import axios from "axios";
import Swal from "sweetalert2";

const instance = axios.create({
    baseURL: "https://52.79.215.19.nip.io",
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.response.use((response) => response,
    async (error) => {
        const status = error.response?.status;
        const message =
            error.response?.data?.message || "요청 처리 중 오류가 발생했습니다.";
        if (status === 401) {
            Swal.fire({
                icon: "warning",
                title: "로그인이 필요합니다",
                text: "다시 로그인해주세요",
            });

            // location.href = "/login";
        } else if (status === 403) {
            Swal.fire({
                icon: "error",
                title: "권한이 없습니다",
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "오류",
                text: message,
            });
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
