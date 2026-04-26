import LoginForm from '../../auth/components/LoginForm';
import RegisterForm from '../../auth/components/RegisterForm';

const tabBaseClassName =
  'rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-brand-mid/20';

export default function AuthPanel({
  authView,
  onChangeAuthView,
  onLogin,
  onRegister,
  submittingAuth,
  error,
}) {
  return (
    <section className="content-width">
      <div className="flex flex-wrap gap-3">
        <button
          className={`${tabBaseClassName} ${
            authView === 'login'
              ? 'bg-brand-dark text-white'
              : 'bg-brand-soft text-brand-dark hover:bg-white'
          }`}
          onClick={() => onChangeAuthView('login')}
          type="button"
        >
          Iniciar sesión
        </button>

        <button
          className={`${tabBaseClassName} ${
            authView === 'register'
              ? 'bg-brand-accent text-white'
              : 'bg-brand-soft text-brand-dark hover:bg-white'
          }`}
          onClick={() => onChangeAuthView('register')}
          type="button"
        >
          Crear cuenta
        </button>
      </div>

      <div className="mt-5">
        {authView === 'login' ? (
          <LoginForm onSubmit={onLogin} loading={submittingAuth} error={error} />
        ) : (
          <RegisterForm onSubmit={onRegister} loading={submittingAuth} error={error} />
        )}
      </div>
    </section>
  );
}
