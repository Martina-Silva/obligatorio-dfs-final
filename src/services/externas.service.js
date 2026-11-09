import { api } from "../config/api.config";

// La traducción con IA puede tardar, así que damos más tiempo que el normal
const TIMEOUT = 30000;

export const buscarRecetasExternasService = async (nombre, idioma) => {
    const res = await api.get("/external/meals/search", {
        params: { nombre, idioma },
        timeout: TIMEOUT,
    });
    return res.data.recetas;
}

export const obtenerRecetaAleatoriaService = async (idioma) => {
    const res = await api.get("/external/meals/random", {
        params: { idioma },
        timeout: TIMEOUT,
    });
    return res.data;
}

// Tip de cocina generado con IA para una receta
export const pedirTipIAService = async (titulo, ingredientes) => {
    const res = await api.post("/ai/tip-ia", { titulo, ingredientes }, { timeout: TIMEOUT });
    return res.data;
}