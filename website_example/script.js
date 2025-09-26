// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded');
    // Further JavaScript logic will go here
});

let web3;
let accounts;

async function connectWallet() {
    if (window.ethereum) {
        try {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            console.log('MetaMask connected. Accounts:', accounts);
            document.getElementById('connectWalletBtn').innerText = `Connected: ${accounts[0].substring(0, 6)}...`;
        } catch (error) {
            console.error('User denied account access or other error:', error);
        }
    } else {
        console.error('MetaMask is not installed. Please consider installing it!');
    }
}

document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
