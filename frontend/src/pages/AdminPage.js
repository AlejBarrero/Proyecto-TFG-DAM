import { useState } from 'react';
import { useAdminDashboard } from '../features/admin/hooks/useAdminDashboard';
import TopNavbar from '../shared/components/TopNavbar';
import { Save, SquarePen, Trash2 } from 'lucide-react';

function AdminPage({ user, onSignOut }) {
  const { users, documents, loading, error, reload, updateUserRole, deleteUser, deleteAdminUser } =
    useAdminDashboard();

  const [editingUserId, setEditingUserId] = useState(null);
  const [editingRole, setEditingRole] = useState('');

  const handleEditUser = (userId, currentRole) => {
    setEditingUserId(userId);
    setEditingRole(currentRole);
  };

  const handleSaveUserRole = async (userId) => {
    try {
      await updateUserRole(userId, editingRole);
      setEditingUserId(null);
      setEditingRole('');
    } catch {}
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm('¿Seguro que quieres eliminar este usuario?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(userId);
    } catch {}
  };

  const handleDeleteDocument = async (documentId) => {
    const confirmed = window.confirm('¿Seguro que quieres eliminar este documento?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminUser(documentId);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-100 text-brand-dark">
      <TopNavbar isAuthenticated onSignOut={onSignOut} />

      <main className="page-shell section-stack py-8" role="main">
        <section className="panel-card">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-mid">
            Sesion activa
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-brand-dark">
                Panel de control global
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Supervisa usuarios y documentos desde una vista centralizada.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <strong className="text-brand-dark">{user.userName}</strong> ({user.role})
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="panel-card">
            <p className="text-sm text-slate-500">Usuarios</p>
            <p className="mt-3 text-4xl font-black text-brand-dark">
              {loading ? '...' : users.length}
            </p>
          </article>

          <article className="panel-card">
            <p className="text-sm text-slate-500">Documentos</p>
            <p className="mt-3 text-4xl font-black text-brand-dark">
              {loading ? '...' : documents.length}
            </p>
          </article>

          <article className="rounded-[28px] bg-brand-dark p-6 text-white shadow-panel sm:p-8 md:col-span-2 xl:col-span-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/70">Estado</p>
                <p className="mt-3 text-2xl font-bold">Dashboard administrativo</p>
              </div>
              <button
                className="rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                onClick={reload}
                type="button"
              >
                Recargar
              </button>
            </div>
          </article>
        </section>

        {error && (
          <div className="rounded-[28px] border border-brand-accent/30 bg-brand-accent/10 px-5 py-4 text-sm text-brand-accent shadow-panel">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6">
          <article className="overflow-hidden rounded-[28px] bg-white shadow-panel">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-bold text-brand-dark">Usuarios</h2>
              <p className="mt-1 text-sm text-slate-500">
                Listado global con rol y número de documentos.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="hidden grid-cols-[88px_minmax(0,2fr)_132px_96px_104px] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 lg:grid">
                <span>ID</span>
                <span>Usuario</span>
                <span>Rol</span>
                <span>Docs</span>
                <span className="text-right">Acciones</span>
              </div>

              {users.map((item) => (
                <div
                  key={item.id}
                  className="border-t border-slate-100 px-6 py-5 first:border-t-0 lg:py-4"
                >
                  <div className="grid gap-4 lg:grid-cols-[88px_minmax(0,2fr)_132px_96px_104px] lg:items-center">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                        ID
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{item.id}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                        Usuario
                      </p>
                      <p className="mt-1 font-semibold text-brand-dark">{item.userName}</p>
                      <p className="break-all text-xs text-slate-500">{item.email}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                        Rol
                      </p>
                      <div className="mt-1">
                        {editingUserId === item.id ? (
                          <select
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-brand-dark"
                            value={editingRole}
                            onChange={(event) => setEditingRole(event.target.value)}
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark">
                            {item.role}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                        Docs
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{item._count?.documents ?? 0}</p>
                    </div>

                    <div className="flex items-center gap-2 lg:justify-end">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                        Acciones
                      </p>
                      {editingUserId === item.id ? (
                        <button
                          className="inline-flex items-center justify-center rounded-full bg-brand-dark p-2 text-white transition hover:bg-brand-mid"
                          onClick={() => handleSaveUserRole(item.id)}
                          type="button"
                          aria-label={`Guardar rol de ${item.userName}`}
                          title="Guardar"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          className="inline-flex items-center justify-center rounded-full bg-brand-accent p-2 text-white transition hover:bg-brand-dark"
                          onClick={() => handleEditUser(item.id, item.role)}
                          type="button"
                          aria-label={`Editar rol de ${item.userName}`}
                          title="Editar"
                        >
                          <SquarePen className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        className="inline-flex items-center justify-center rounded-full bg-red-500 p-2 text-white transition hover:bg-red-600"
                        onClick={() => handleDeleteUser(item.id)}
                        type="button"
                        aria-label={`Eliminar usuario ${item.userName}`}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && users.length === 0 && (
                <div className="px-6 py-6 text-sm text-slate-500">
                  No hay usuarios para mostrar.
                </div>
              )}
            </div>
          </article>

          <article className="overflow-hidden rounded-[28px] bg-white shadow-panel">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-bold text-brand-dark">Documentos</h2>
              <p className="mt-1 text-sm text-slate-500">
                Vista consolidada de documentos con su propietario y el idioma detectado.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="hidden grid-cols-[88px_minmax(0,2fr)_112px_minmax(0,1.7fr)_64px] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 lg:grid">
                <span>ID</span>
                <span>Archivo</span>
                <span>Idioma</span>
                <span>Propietario</span>
                <span className="text-right">Accion</span>
              </div>

              {documents.map((item) => (
                <div
                  key={item.id}
                  className="border-t border-slate-100 px-6 py-5 first:border-t-0 lg:py-4"
                >
                  <div className="grid gap-4 lg:grid-cols-[88px_minmax(0,2fr)_112px_minmax(0,1.7fr)_64px] lg:items-center">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                        ID
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{item.id}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                        Archivo
                      </p>
                      <p className="mt-1 break-words font-semibold text-brand-dark">
                        {item.title || item.fileName}
                      </p>
                      <p className="break-all text-xs text-slate-500">{item.fileName}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                        Idioma
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{item.languageCode}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                        Propietario
                      </p>
                      <p className="mt-1 font-semibold text-brand-dark">
                        {item.user?.userName || '-'}
                      </p>
                      <p className="break-all text-xs text-slate-500">
                        {item.user?.email || '-'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 lg:justify-end">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                        Accion
                      </p>
                      <button
                        className="inline-flex items-center justify-center rounded-full bg-red-500 p-2 text-white transition hover:bg-red-600"
                        onClick={() => handleDeleteDocument(item.id)}
                        type="button"
                        aria-label={`Eliminar documento ${item.fileName}`}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && documents.length === 0 && (
                <div className="px-6 py-6 text-sm text-slate-500">
                  No hay documentos para mostrar.
                </div>
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default AdminPage;
