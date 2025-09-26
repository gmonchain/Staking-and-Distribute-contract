import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';

const Navbar: React.FC = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f0f0f0',
      borderBottom: '1px solid #ccc'
    }}>
      <h1>DApp Staking</h1>
      <ConnectWalletButton />
    </nav>
  );
};

export default Navbar;
