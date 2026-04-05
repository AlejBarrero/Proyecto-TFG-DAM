import { useState } from 'react';

const inputClassName =
  'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-dark shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-mid focus:ring-4 focus:ring-brand-mid/15';

export default function LoginForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

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
          Acceso
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-brand-dark">Iniciar sesión</h2>
        <p className="text-sm leading-6 text-slate-500">
          Accede a tu cuenta para guardar documentos, revisarlos más tarde y usar el panel que te
          corresponda según tu rol.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <label className="block text-sm font-semibold text-brand-dark">
          Email
          <input
            className={inputClassName}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />
        </label>

        <label className="block text-sm font-semibold text-brand-dark">
          Contraseña
          <input
            className={inputClassName}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Tu contraseña"
            required
          />
        </label>

        {error && (
          <p className="rounded-2xl border border-brand-accent/30 bg-brand-accent/10 px-4 py-3 text-sm text-brand-accent">
            {error}
          </p>
        )}

        <button
          className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-dark px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-mid focus:outline-none focus:ring-4 focus:ring-brand-mid/20 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  );
}
