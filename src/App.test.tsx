import { render, screen } from '@testing-library/react';
import App from './App';

// Best test coverage ever!!

test('renders learn react link', () => {
  render(<App />);
  const boxElement = screen.getByText(/randomly/i);
  expect(boxElement).toBeInTheDocument();
});
