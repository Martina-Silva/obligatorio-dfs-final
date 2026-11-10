import { api } from "../config/api.config";

export const obtenerRecetasPublicasService = async ({ pagina, limite, filtros }) => {
    const params = { page: pagina, limit: limite };

    if (filtros.titulo && filtros.titulo.trim() !== "") {
        params.titulo = filtros.titulo.trim();
    }
    if (filtros.categoria) {
        params.categoria = filtros.categoria;
    }
    if (Number(filtros.tiempoMax) >= 1) {
        params.tiempoMax = Number(filtros.tiempoMax);
    }

    const res = await api.get("/recipes", { params });
    return res.data;
}

export const obtenerRecetaPorIdService = async (id) => {
    const res = await api.get(`/recipes/${id}`);
    return res.data;
}