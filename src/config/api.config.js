import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://obligatorio-dfs-seven.vercel.app/api/v1",
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
    (respuesta) => respuesta,
    (error) => {
        if (error.response?.status === 401 && localStorage.getItem("token")) {
            localStorage.clear();
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
)