import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { ethers } from 'ethers';

// Mocking ethers.js and the Ethereum provider
jest.mock('ethers', () => {
  const actualEthers = jest.requireActual('ethers');
  return {
    ...actualEthers,
    BrowserProvider: jest.fn(() => ({
      send: jest.fn(),
      getBalance: jest.fn().mockResolvedValue('1000000000000000000'),
      getSigner: jest.fn(() => ({
        sendTransaction: jest.fn().mockResolvedValue({ wait: jest.fn() }),
      })),
    })),
    utils: {
      ...actualEthers.utils,
      formatEther: jest.fn().mockImplementation((value) => parseFloat(value).toFixed(4)),
      parseUnits: jest.fn().mockImplementation((value) => BigInt(value * 1e18)),
    },
  };
});

test('renders connect button initially', () => {
  render(<App />);
  const connectButton = screen.getByText(/conectar metamask/i);
  expect(connectButton).toBeInTheDocument();
});

test('shows account info and disconnect button after connecting', async () => {
  render(<App />);

  // Mock MetaMask account and provider methods
  window.ethereum = {
    request: jest.fn().mockResolvedValue(['0x123']),
  };

  // Mock provider methods
  const mockProvider = {
    getBalance: jest.fn().mockResolvedValue('1000000000000000000'), // 1 ETH
    getSigner: jest.fn(() => ({
      sendTransaction: jest.fn().mockResolvedValue({ wait: jest.fn() }),
    })),
    send: jest.fn().mockResolvedValue(['0x123']),
  };

  jest.spyOn(ethers, 'BrowserProvider').mockImplementation(() => mockProvider);

  const connectButton = screen.getByText(/conectar metamask/i);
  fireEvent.click(connectButton);

  const accountInfo = await screen.findByText(/cuenta conectada: 0x123/i);
  expect(accountInfo).toBeInTheDocument();

  const disconnectButton = screen.getByText(/desconectar metamask/i);
  expect(disconnectButton).toBeInTheDocument();
});
