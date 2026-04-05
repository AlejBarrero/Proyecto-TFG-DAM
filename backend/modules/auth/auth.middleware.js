import jwt from 'jsonwebtoken';
import { AUTH_TOKEN_HEADER_PREFIX } from './auth.constants.js';

const JWT_SECRET = process.env.JWT_SECRET;

const extractTokenFromHeader = (authorizationHeader) => {
  if (!authorizationHeader?.startsWith(AUTH_TOKEN_HEADER_PREFIX)) {
    return null;
  }

  return authorizationHeader.slice(AUTH_TOKEN_HEADER_PREFIX.length).trim();
};

export const requireAuth = (req, _res, next) => {
  if (!JWT_SECRET) {
    const error = new Error('Falta configurar JWT_SECRET en las variables de entorno.');
    error.statusCode = 500;
    return next(error);
  }

  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    const error = new Error('No autorizado. Debes iniciar sesion.');
    error.statusCode = 401;
    return next(error);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      role: payload.role,
    };

    return next();
  } catch {
    const error = new Error('Token invalido o expirado.');
    error.statusCode = 401;
    return next(error);
  }
};

export const requireAdmin = (req, _res, next) => {
  if (!req.user) {
    const error = new Error('No autorizado. Debes iniciar sesion.');
    error.statusCode = 401;
    return next(error);
  }

  if (req.user.role !== 'admin') {
    const error = new Error('Acceso denegado. Se requiere rol admin.');
    error.statusCode = 403;
    return next(error);
  }

  return next();
};
