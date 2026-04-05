import { z } from 'zod';

const userNameSchema = z
  .string()
  .min(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
  .max(30, 'El nombre de usuario no puede superar los 30 caracteres.')
  .regex(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, numeros y guion bajo.');

const emailSchema = z.email('Introduce un email valido.');

const passwordSchema = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres.')
  .max(72, 'La contraseña no puede superar los 72 caracteres.');

export const registerSchema = z.object({
  userName: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es obligatoria.'),
});

const validateWithSchema = (schema, payload) => {
  const result = schema.safeParse(payload);

  if (!result.success) {
    const error = new Error(result.error.issues[0]?.message || 'Datos no validos.');
    error.statusCode = 400;
    throw error;
  }

  return result.data;
};

export const validateRegisterInput = (payload) => {
  return validateWithSchema(registerSchema, payload);
};

export const validateLoginInput = (payload) => {
  return validateWithSchema(loginSchema, payload);
};
