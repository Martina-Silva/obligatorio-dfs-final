import Joi from "joi";

export const categoriaSchema = Joi.object({
    nombre: Joi.string().trim().min(2).max(50).required().messages({
        "string.empty": "El nombre es obligatorio",
        "string.min": "El nombre debe tener al menos 2 caracteres",
        "string.max": "El nombre no puede superar los 50 caracteres",
        "any.required": "El nombre es obligatorio",
    }),
    descripcion: Joi.string().trim().allow("").max(200).messages({
        "string.max": "La descripción no puede superar los 200 caracteres",
    }),
});