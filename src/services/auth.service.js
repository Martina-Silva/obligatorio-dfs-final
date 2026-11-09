import { api } from "../config/api.config";

export const obtenerPerfilService = async () => {
    const res = await api.get("/users/me");
    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
}

export const iniciarSesionService = async (email, password) => {
    const resLogin = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", resLogin.data.token);

    try {
        return await obtenerPerfilService();
    } catch (error) {
        localStorage.removeItem("token");
        throw error;
    }
}

export const registrarUsuarioService = async (username, email, password) => {
    const res = await api.post("/auth/register", { username, email, password });
    return res.data;
}