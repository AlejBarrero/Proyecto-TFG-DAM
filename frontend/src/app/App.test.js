import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /pdf2voice/i });
  expect(headingElement).toBeInTheDocument();
});
