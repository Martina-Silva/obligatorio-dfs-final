import { api } from "../config/api.config";

export const obtenerMisRecetasService = async (filtros = {}) => {
    const params = {};

    if (filtros.titulo && filtros.titulo.trim() !== "") {
        params.titulo = filtros.titulo.trim();
    }
    if (filtros.categoria) {
        params.categoria = filtros.categoria;
    }
    if (Number(filtros.tiempoMax) >= 1) {
        params.tiempoMax = Number(filtros.tiempoMax);
    }

    const res = await api.get("/users/me/recipes", { params });
    return res.data.recetas;
}

export const obtenerCategoriasService = async () => {
    const res = await api.get("/categories");
    return res.data;
}

// Sube la imagen a Cloudinary (vía el backend) y devuelve la URL
export const subirImagenService = async (archivo) => {
    const formData = new FormData();
    formData.append("imagen", archivo);
    const res = await api.post("/recipes/upload", formData);
    return res.data.url;
}

export const crearRecetaService = async (datos) => {
    const res = await api.post("/recipes", datos);
    return res.data.receta;
}

export const actualizarRecetaService = async (id, datos) => {
    const res = await api.put(`/recipes/${id}`, datos);
    return res.data.receta;
}

export const eliminarRecetaService = async (id) => {
    await api.delete(`/recipes/${id}`);
}