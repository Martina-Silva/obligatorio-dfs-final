export const obtenerMensajeError = (error) => {
    const data = error.response?.data;

    if (data?.errores?.length) {
        return data.errores.join(". ");
    }
    if (data?.message) {
        return data.message;
    }
    return "No se pudo conectar con el servidor. Intentá de nuevo.";
}