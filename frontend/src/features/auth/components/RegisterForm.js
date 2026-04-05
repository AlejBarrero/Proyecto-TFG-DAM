import { useState } from 'react';

const inputClassName =
  'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-dark shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-mid focus:ring-4 focus:ring-brand-mid/15';

const getFieldError = (error, field) => {
  if (!error) return '';

  const normalizedError = error.toLowerCase();

  if (field === 'userName' && normalizedError.includes('nombre de usuario')) {
    return 'Ese nombre de usuario ya existe. Elige otro distinto.';
  }

  if (field === 'email' && normalizedError.includes('email')) {
    return 'Ese email ya esta registrado. Usa otro diferente o inicia sesion.';
  }

  return '';
};

export default function RegisterForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
  });

  const userNameError = getFieldError(error, 'userName');
  const emailError = getFieldError(error, 'email');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await onSubmit(form);
    } catch {}
  };

  return (
    <section className="mx-auto w-full max-w-2xl rounded-[24px] border border-white/60 bg-white/90 p-5 shadow-panel backdrop-blur sm:rounded-[28px] sm:p-8 lg:p-10">
      <div className="mb-6 space-y-2 sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-mid">
          Registro
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-brand-dark">Crear cuenta</h2>
        <p className="text-sm leading-6 text-slate-500">
          Regístrate para guardar documentos, conservar tus audios y acceder a las funciones según
          tu rol de usuario.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <label className="block text-sm font-semibold text-brand-dark">
          Nombre de usuario
          <input
            className={`${inputClassName} ${userNameError ? 'border-brand-accent focus:border-brand-accent focus:ring-brand-accent/20' : ''}`}
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            minLength={3}
            maxLength={30}
            placeholder="Tu nombre público"
            required
          />
          {userNameError && (
            <span className="mt-2 block text-xs text-brand-accent">{userNameError}</span>
          )}
        </label>

        <label className="block text-sm font-semibold text-brand-dark">
          Email
          <input
            className={`${inputClassName} ${emailError ? 'border-brand-accent focus:border-brand-accent focus:ring-brand-accent/20' : ''}`}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />
          {emailError && <span className="mt-2 block text-xs text-brand-accent">{emailError}</span>}
        </label>

        <label className="block text-sm font-semibold text-brand-dark">
          Contraseña
          <input
            className={inputClassName}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            maxLength={72}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </label>

        {error && !userNameError && !emailError && (
          <p className="rounded-2xl border border-brand-accent/30 bg-brand-accent/10 px-4 py-3 text-sm text-brand-accent">
            {error}
          </p>
        )}

        <button
          className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-accent px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand-accent/20 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
    </section>
  );
}
