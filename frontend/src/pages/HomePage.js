import { useState } from 'react';
import FileUploader from '../features/upload/components/FileUploader';
import { useAuthSession } from '../features/auth/hooks/useAuthSession';
import AuthPanel from '../features/home/components/AuthPanel';
import MarketingHero from '../shared/components/MarketingHero';
import TopNavbar from '../shared/components/TopNavbar';
import AdminPage from './AdminPage';
import UserDocumentsPage from './UserDocumentsPage';

function HomePage() {
  const { user, loading, error, isAuthenticated, signIn, signUp, signOut } = useAuthSession();
  const [submittingAuth, setSubmittingAuth] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [showAuthPanel, setShowAuthPanel] = useState(false);

  const handleLogin = async (credentials) => {
    setSubmittingAuth(true);

    try {
      await signIn(credentials);
    } catch {
      // El hook ya guarda el mensaje de error para mostrarlo en el formulario.
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleRegister = async (payload) => {
    setSubmittingAuth(true);

    try {
      await signUp(payload);
    } catch {
      // El hook ya guarda el mensaje de error para mostrarlo en el formulario.
    } finally {
      setSubmittingAuth(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="rounded-[28px] bg-white px-8 py-6 text-sm font-semibold text-brand-dark shadow-panel">
          Cargando sesión...
        </div>
      </div>
    );
  }

  if (isAuthenticated && user?.role === 'admin') {
    return <AdminPage user={user} onSignOut={signOut} />;
  }

  if (isAuthenticated && user?.role === 'user') {
    return <UserDocumentsPage user={user} onSignOut={signOut} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-brand-dark">
      <TopNavbar
        isAuthenticated={false}
        onAuthAction={() => setShowAuthPanel((value) => !value)}
        authActionLabel={showAuthPanel ? 'Ocultar acceso' : 'Acceder o registrarse'}
      />
      <MarketingHero />

      <main className="page-shell section-stack py-8" role="main">
        {!isAuthenticated && showAuthPanel && (
          <AuthPanel
            authView={authView}
            onChangeAuthView={setAuthView}
            onLogin={handleLogin}
            onRegister={handleRegister}
            submittingAuth={submittingAuth}
            error={error}
          />
        )}

        <section className="section-stack">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-mid">
              Conversión
            </p>
            <h2 className="text-2xl font-black tracking-tight text-brand-dark sm:text-3xl">
              Prueba la conversion sin cuenta
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
              En modo invitado el archivo se convierte de forma temporal y no se persiste en la base
              de datos.
            </p>
          </div>

          <div className="mx-auto w-full">
            <FileUploader isAuthenticated={false} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
