import Joi from "joi";

export const buscarSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).required().messages({
        "string.empty": "Escribí qué receta querés buscar",
        "string.min": "Escribí al menos 2 caracteres",
        "string.max": "No puede superar los 50 caracteres",
        "any.required": "Escribí qué receta querés buscar",
    }),
    idioma: Joi.string().valid("es", "en").required(),
});

export const guardarExternaSchema = Joi.object({
    tiempoPreparacionMin: Joi.number().integer().min(1).max(1440).required().messages({
        "number.base": "El tiempo debe ser un número",
        "number.integer": "El tiempo debe ser un número entero",
        "number.min": "El tiempo debe ser mayor a 0 minutos",
        "number.max": "El tiempo no puede superar las 24 horas (1440 min)",
        "any.required": "El tiempo es obligatorio",
    }),
    categoria: Joi.string().hex().length(24).required().messages({
        "string.empty": "Elegí una categoría",
        "string.length": "Elegí una categoría",
        "string.hex": "Elegí una categoría",
        "any.required": "Elegí una categoría",
    }),
});