import { prisma } from '../../lib/prisma.js';

export const listAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userName: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          documents: true,
        },
      },
    },
  });
};

export const listAllDocuments = async () => {
  return prisma.document.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fileName: true,
      title: true,
      author: true,
      genre: true,
      textType: true,
      isPublic: true,
      languageCode: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          userName: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const updateUserRole = async (userId, role) => {
  if (!Number.isInteger(userId)) {
    const error = new Error('Identificador de usuario no válido.');
    error.statusCode = 400;
    throw error;
  }

  if (!['user', 'admin'].includes(role)) {
    const error = new Error('Rol no válido.');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!existingUser) {
    const error = new Error('Usuario no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      userName: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          documents: true,
        },
      },
    },
  });
};

export const deleteUser = async (userId, currentAdminId) => {
  if (!Number.isInteger(userId)) {
    const error = new Error('Identificador de usuario no válido.');
    error.statusCode = 400;
    throw error;
  }

  if (userId === currentAdminId) {
    const error = new Error('No puedes eliminar tu propio usuario administrador.');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, userName: true, email: true },
  });

  if (!existingUser) {
    const error = new Error('Usuario no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return {
    message: 'Usuario eliminado correctamente.',
    deletedUserId: userId,
  };
};

export const deleteAdminDocument = async (documentId) => {
  if (!Number.isInteger(documentId)) {
    const error = new Error('Identificador de documento no válido.');
    error.statusCode = 400;
    throw error;
  }

  const existingDocument = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, fileName: true },
  });

  if (!existingDocument) {
    const error = new Error('Documento no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  await prisma.document.delete({
    where: { id: documentId },
  });

  return {
    message: 'Documento eliminado correctamente.',
    deletedDocumentId: documentId,
  };
};
  