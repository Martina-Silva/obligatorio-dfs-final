import Joi from "joi";

export const recetaSchema = Joi.object({
    titulo: Joi.string().trim().min(3).max(100).required().messages({
        "string.empty": "El título es obligatorio",
        "string.min": "El título debe tener al menos 3 caracteres",
        "string.max": "El título no puede superar los 100 caracteres",
        "any.required": "El título es obligatorio",
    }),
    ingredientes: Joi.string().trim().required().messages({
        "string.empty": "Ingresá al menos un ingrediente",
        "any.required": "Ingresá al menos un ingrediente",
    }),
    instrucciones: Joi.string().trim().min(10).required().messages({
        "string.empty": "Las instrucciones son obligatorias",
        "string.min": "Las instrucciones deben tener al menos 10 caracteres",
        "any.required": "Las instrucciones son obligatorias",
    }),
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