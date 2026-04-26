import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../components/LoginForm';

describe('LoginForm', () => {
  test('envia el email y la contrasena al hacer submit', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(<LoginForm onSubmit={onSubmit} loading={false} error={null} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'ana@example.com');
    await userEvent.type(screen.getByLabelText(/contrase.a/i), 'secreta123');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: 'secreta123',
    });
  });

  test('muestra el estado loading y deshabilita el boton', () => {
    render(<LoginForm onSubmit={jest.fn()} loading error={null} />);

    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();
  });

  test('muestra el error recibido por props', () => {
    render(
      <LoginForm
        onSubmit={jest.fn()}
        loading={false}
        error="Credenciales incorrectas."
      />
    );

    expect(screen.getByText('Credenciales incorrectas.')).toBeInTheDocument();
  });
});
