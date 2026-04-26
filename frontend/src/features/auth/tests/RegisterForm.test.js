import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../components/RegisterForm';

describe('RegisterForm', () => {
  test('envia userName, email y password al hacer submit', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<RegisterForm onSubmit={onSubmit} loading={false} error={null} />);

    await userEvent.type(screen.getByLabelText(/nombre de usuario/i), 'ana_dev');
    await userEvent.type(screen.getByLabelText(/email/i), 'ana@example.com');
    await userEvent.type(screen.getByLabelText(/contrase.a/i), 'secreta123');
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      userName: 'ana_dev',
      email: 'ana@example.com',
      password: 'secreta123',
    });
  });

  test('muestra error especifico de nombre de usuario', () => {
    render(
      <RegisterForm
        onSubmit={jest.fn()}
        loading={false}
        error="El nombre de usuario ya existe."
      />
    );

    expect(
      screen.getByText('Ese nombre de usuario ya existe. Elige otro distinto.')
    ).toBeInTheDocument();
  });

  test('muestra error especifico de email', () => {
    render(
      <RegisterForm
        onSubmit={jest.fn()}
        loading={false}
        error="Ese email ya existe."
      />
    );

    expect(
      screen.getByText('Ese email ya esta registrado. Usa otro diferente o inicia sesion.')
    ).toBeInTheDocument();
  });

  test('muestra error generico cuando no pertenece a un campo concreto', () => {
    render(
      <RegisterForm
        onSubmit={jest.fn()}
        loading={false}
        error="No se pudo crear la cuenta."
      />
    );

    expect(screen.getByText('No se pudo crear la cuenta.')).toBeInTheDocument();
  });
});
