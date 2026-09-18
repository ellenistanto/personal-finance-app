import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

test('renders finance dashboard shell', async () => {
  axios.get.mockResolvedValue({ data: [] });

  render(<App />);

  expect(screen.getByRole('heading', { name: /ringkasan keuangan/i })).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /navigasi utama/i })).toBeInTheDocument();
  expect(screen.getByText(/total pemasukan/i)).toBeInTheDocument();
  expect(await screen.findByText(/belum ada transaksi/i)).toBeInTheDocument();
});
