import { api } from "../config/api.config";

export const cambiarPlanService = async () => {
    const res = await api.patch("/users/cambiar-plan");
    return res.data.usuario;
}

export const obtenerEstadisticasService = async () => {
    const res = await api.get("/users/me/stats");
    return res.data;
}