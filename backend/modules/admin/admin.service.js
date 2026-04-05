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
