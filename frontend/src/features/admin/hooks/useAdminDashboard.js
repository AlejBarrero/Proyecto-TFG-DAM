import { useEffect, useState } from 'react';
import {
  getAdminDocuments,
  getAdminUsers,
  updateAdminUserRole,
  deleteAdminUser
} from '../../../shared/api/adminApi';

export function useAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersData, documentsData] = await Promise.all([getAdminUsers(), getAdminDocuments()]);

      setUsers(usersData);
      setDocuments(documentsData);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar los datos de administración.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    setError(null);

    try {
      const updatedUser = await updateAdminUserRole(userId, role);

      setUsers((current) =>
        current.map((item) => (item.id === userId ? { ...item, role: updatedUser.role } : item))
      );

      return updatedUser;
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo actualizar el rol del usuario.';
      setError(message);
      throw err;
    }
  };

  const deleteUser = async (userId) => {
  setError(null);

  try {
    await deleteAdminUser(userId);

    setUsers((current) => current.filter((item) => item.id !== userId));
    setDocuments((current) => current.filter((item) => item.user?.id !== userId));
  } catch (err) {
    setError(err.response?.data?.message || 'No se pudo eliminar el usuario.');
    throw err;
  }
};


  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    users,
    documents,
    loading,
    error,
    reload: loadDashboard,
    updateUserRole,
    deleteUser,
  };
}
