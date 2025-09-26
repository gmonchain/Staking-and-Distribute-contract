// This will contain our web3.js/ethers.js code for interacting with the contracts.

let web3;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected to MetaMask.");
        } catch (error) {
            console.error("User denied account access or other error:", error);
        }
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
        console.log("Connected to legacy web3 provider.");
    } else {
        // Fallback to a local Ganache instance if no web3 provider is detected
        console.warn("No Web3 provider detected. Falling back to Ganache (http://127.0.0.1:8545). Please install MetaMask or use a dApp browser.");
        web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
    }

    if (web3) {
        console.log("Web3 initialized:", web3);
        // We'll add contract loading and interaction here later
    }
});
