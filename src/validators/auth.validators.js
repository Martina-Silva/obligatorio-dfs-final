import Joi from "joi";

const emailRule = Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
        "string.empty": "El email es obligatorio",
        "string.email": "Ingresá un email válido",
        "any.required": "El email es obligatorio",
    });

export const loginSchema = Joi.object({
    email: emailRule,
    password: Joi.string().required().messages({
        "string.empty": "La contraseña es obligatoria",
        "any.required": "La contraseña es obligatoria",
    }),
});

export const registroSchema = Joi.object({
    username: Joi.string().trim().min(3).max(30).required().messages({
        "string.empty": "El nombre de usuario es obligatorio",
        "string.min": "El nombre de usuario debe tener al menos 3 caracteres",
        "string.max": "El nombre de usuario no puede superar los 30 caracteres",
        "any.required": "El nombre de usuario es obligatorio",
    }),
    email: emailRule,
    password: Joi.string().min(6).required().messages({
        "string.empty": "La contraseña es obligatoria",
        "string.min": "La contraseña debe tener al menos 6 caracteres",
        "any.required": "La contraseña es obligatoria",
    }),
    repetirPassword: Joi.any().valid(Joi.ref("password")).required().messages({
        "any.only": "Las contraseñas no coinciden",
        "any.required": "Repetí la contraseña",
    }),
});