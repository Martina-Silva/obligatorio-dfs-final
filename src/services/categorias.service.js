import { api } from "../config/api.config";

export const obtenerCategoriaPorIdService = async (id) => {
    const res = await api.get(`/categories/${id}`);
    return res.data.categoria ?? res.data;
}

export const crearCategoriaService = async (datos) => {
    const res = await api.post("/categories", datos);
    return res.data.categoria ?? res.data;
}

export const actualizarCategoriaService = async (id, datos) => {
    const res = await api.put(`/categories/${id}`, datos);
    return res.data.categoria ?? res.data;
}

export const eliminarCategoriaService = async (id) => {
    await api.delete(`/categories/${id}`);
}