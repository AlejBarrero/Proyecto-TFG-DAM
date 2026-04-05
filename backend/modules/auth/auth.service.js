import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { DEFAULT_JWT_EXPIRES_IN } from './auth.constants.js';
import { validateLoginInput, validateRegisterInput } from './auth.validator.js';

const JWT_SECRET = process.env.JWT_SECRET;
const PASSWORD_SALT_ROUNDS = parseInt(process.env.PASSWORD_SALT_ROUNDS || '10', 10);

const ensureJwtSecret = () => {
  if (!JWT_SECRET) {
    const error = new Error('Falta configurar JWT_SECRET en las variables de entorno.');
    error.statusCode = 500;
    throw error;
  }
};

const sanitizeEmail = (email) => email.trim().toLowerCase();
const sanitizeUserName = (userName) => userName.trim().toLowerCase();

const createAccessToken = (user) => {
  ensureJwtSecret();

  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: DEFAULT_JWT_EXPIRES_IN }
  );
};

const buildAuthResponse = (user) => ({
  token: createAccessToken(user),
  user: {
    id: user.id,
    userName: user.userName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  },
});

export const registerUser = async (payload) => {
  const { userName, email, password } = validateRegisterInput(payload);
  const normalizedEmail = sanitizeEmail(email);
  const normalizedUserName = sanitizeUserName(userName);

  const existingUserByEmail = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUserByEmail) {
    const error = new Error('Ya existe un usuario con ese email.');
    error.statusCode = 409;
    throw error;
  }

  const existingUserByUserName = await prisma.user.findUnique({
    where: { userName: normalizedUserName },
  });

  if (existingUserByUserName) {
    const error = new Error('Ese nombre de usuario ya esta en uso.');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      userName: normalizedUserName,
      email: normalizedEmail,
      passwordHash,
      role: 'user',
    },
  });

  return buildAuthResponse(user);
};

export const loginUser = async (payload) => {
  const { email, password } = validateLoginInput(payload);
  const normalizedEmail = sanitizeEmail(email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    const error = new Error('Credenciales invalidas.');
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    const error = new Error('Credenciales invalidas.');
    error.statusCode = 401;
    throw error;
  }

  return buildAuthResponse(user);
};

export const getCurrentUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error('Usuario no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return user;
};
