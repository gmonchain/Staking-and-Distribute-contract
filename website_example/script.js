// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded');
    // Further JavaScript logic will go here
});

let web3;

async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            console.log('MetaMask connected:', web3);
        } catch (error) {
            console.error('User denied account access or other error:', error);
        }
    } else {
        console.error('MetaMask is not installed. Please consider installing it!');
    }
}

document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
