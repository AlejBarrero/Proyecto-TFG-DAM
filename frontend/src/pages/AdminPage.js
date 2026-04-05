import { useAdminDashboard } from '../features/admin/hooks/useAdminDashboard';
import MarketingHero from '../shared/components/MarketingHero';
import TopNavbar from '../shared/components/TopNavbar';

function AdminPage({ user, onSignOut }) {
  const { users, documents, loading, error, reload } = useAdminDashboard();

  return (
    <div className="min-h-screen bg-slate-100 text-brand-dark">
      <TopNavbar isAuthenticated onSignOut={onSignOut} />
      <MarketingHero
        eyebrow="Administracion"
        title="Convierte documentos PDF en audio con una experiencia dual."
        description="Los invitados pueden convertir temporalmente. Los usuarios autenticados guardan sus documentos, y los administradores acceden a una vista de control global."
      />

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

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          <article className="overflow-hidden rounded-[28px] bg-white shadow-panel">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-bold text-brand-dark">Usuarios</h2>
              <p className="mt-1 text-sm text-slate-500">
                Listado global con rol y número de documentos.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-brand-dark">
                  <tr>
                    <th className="px-4 py-3 font-semibold sm:px-6 sm:py-4">ID</th>
                    <th className="px-4 py-3 font-semibold sm:px-6 sm:py-4">Usuario</th>
                    <th className="px-4 py-3 font-semibold sm:px-6 sm:py-4">Rol</th>
                    <th className="px-4 py-3 font-semibold sm:px-6 sm:py-4">Docs</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 text-slate-500 sm:px-6 sm:py-4">{item.id}</td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="font-semibold text-brand-dark">{item.userName}</div>
                        <div className="text-xs text-slate-500">{item.email}</div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark">
                          {item.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600 sm:px-6">
                        {item._count?.documents ?? 0}
                      </td>
                    </tr>
                  ))}
                  {!loading && users.length === 0 && (
                    <tr>
                      <td className="px-6 py-6 text-slate-500" colSpan="4">
                        No hay usuarios para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="overflow-hidden rounded-[28px] bg-white shadow-panel">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-bold text-brand-dark">Documentos</h2>
              <p className="mt-1 text-sm text-slate-500">
                Vista consolidada de documentos con su propietario y el idioma detectado.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-brand-dark">
                  <tr>
                    <th className="px-4 py-4 font-semibold sm:px-6">ID</th>
                    <th className="px-4 py-4 font-semibold sm:px-6">Archivo</th>
                    <th className="px-4 py-4 font-semibold sm:px-6">Idioma</th>
                    <th className="px-4 py-4 font-semibold sm:px-6">Propietario</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100 align-top">
                      <td className="px-4 py-4 text-slate-500 sm:px-6">{item.id}</td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="font-semibold text-brand-dark">
                          {item.title || item.fileName}
                        </div>
                        <div className="text-xs text-slate-500">{item.fileName}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600 sm:px-6">{item.languageCode}</td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="font-semibold text-brand-dark">
                          {item.user?.userName || '-'}
                        </div>
                        <div className="text-xs text-slate-500">{item.user?.email || '-'}</div>
                      </td>
                    </tr>
                  ))}
                  {!loading && documents.length === 0 && (
                    <tr>
                      <td className="px-6 py-6 text-slate-500" colSpan="4">
                        No hay documentos para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default AdminPage;
