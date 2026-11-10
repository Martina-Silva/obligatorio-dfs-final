import { api } from "../config/api.config";

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

export const traducirRecetaExternaService = async (idExterno) => {
    const res = await api.get(`/external/meals/${idExterno}`, {
        params: { idioma: "es" },
        timeout: TIMEOUT,
    });
    return res.data;
}

export const pedirTipIAService = async (titulo, ingredientes) => {
    const res = await api.post("/ai/tip-ia", { titulo, ingredientes }, { timeout: TIMEOUT });
    return res.data;
}