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

        // Load contract ABIs
        const splitterAbi = await fetch('./abis/Splitter.json').then(response => response.json());
        const rebaseAbi = await fetch('./abis/Rebase.json').then(response => response.json());

        // Replace with your actual deployed contract addresses
        const splitterAddress = '0xYourDistributeContractAddressHere'; 
        const rebaseAddress = '0xYourStakingContractAddressHere';

        const distributeContract = new web3.eth.Contract(splitterAbi, splitterAddress);
        const stakingContract = new web3.eth.Contract(rebaseAbi, rebaseAddress);

        console.log("Distribute Contract:", distributeContract);
        console.log("Staking Contract:", stakingContract);

        // --- Distribute Contract Functions ---
        async function getSplitterRecipients() {
            try {
                const recipients = await distributeContract.methods.getRecipients().call();
                console.log("Distribute Contract Recipients:", recipients);
                return recipients;
            } catch (error) {
                console.error("Error getting distribute contract recipients:", error);
                return [];
            }
        }

        // --- Staking Contract Functions ---
        async function getTotalStakedAmount() {
            try {
                const totalStaked = await stakingContract.methods.getTotalStaked().call();
                console.log("Total Staked Amount:", web3.utils.fromWei(totalStaked, 'ether'));
                return web3.utils.fromWei(totalStaked, 'ether');
            } catch (error) {
                console.error("Error getting total staked amount:", error);
                return '0';
            }
        }

        // Call read functions on load
        getSplitterRecipients();
        getTotalStakedAmount();

        // We'll add contract loading and interaction here later
    }
});
