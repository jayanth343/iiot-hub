import { useState, useEffect } from 'react';
import web3 from '../utils/web3';

export default function WalletConnect() {
  const [address, setAddress] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    if (window.ethereum) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setConnected(true);
      }
    }
  }

  async function connect() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);
        setConnected(true);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.log('Please install MetaMask!');
    }
  }

  return (
    <div>
      {connected ? (
        <p>Connected: {address}</p>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}