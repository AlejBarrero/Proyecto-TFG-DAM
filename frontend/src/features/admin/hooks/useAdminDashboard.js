import { useEffect, useState } from 'react';
import { getAdminDocuments, getAdminUsers } from '../../../shared/api/adminApi';

export function useAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersData, documentsData] = await Promise.all([
        getAdminUsers(),
        getAdminDocuments(),
      ]);

      setUsers(usersData);
      setDocuments(documentsData);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar los datos de administración.');
    } finally {
      setLoading(false);
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
  };
}
