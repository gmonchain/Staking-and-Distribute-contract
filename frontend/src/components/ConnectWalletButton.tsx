import React, { useState } from 'react';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}

const ConnectWalletButton: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User denied account access or other error:", error);
      }
    } else {
      console.error("MetaMask is not installed. Please install it to use this app.");
    }
  };

  return (
    <button onClick={connectWallet}>
      {account ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Connect Wallet"}
    </button>
  );
};

export default ConnectWalletButton;
