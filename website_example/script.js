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

        const splitterRecipientsSpan = document.getElementById('splitterRecipients');
        const totalStakedAmountSpan = document.getElementById('totalStakedAmount');
        const newRecipientAddressInput = document.getElementById('newRecipientAddress');
        const addRecipientBtn = document.getElementById('addRecipientBtn');
        const stakeAmountInput = document.getElementById('stakeAmount');
        const stakeBtn = document.getElementById('stakeBtn');

        let accounts;

        // Get accounts
        web3.eth.getAccounts().then(_accounts => {
            accounts = _accounts;
            console.log("Accounts:", accounts);
        });

        // --- Distribute Contract Functions ---
        async function getSplitterRecipients() {
            try {
                const recipients = await distributeContract.methods.getRecipients().call();
                console.log("Distribute Contract Recipients:", recipients);
                splitterRecipientsSpan.textContent = recipients.length > 0 ? recipients.join(', ') : 'None';
                return recipients;
            } catch (error) {
                console.error("Error getting distribute contract recipients:", error);
                splitterRecipientsSpan.textContent = 'Error loading recipients.';
                return [];
            }
        }

        async function addRecipient() {
            const recipientAddress = newRecipientAddressInput.value;
            if (!web3.utils.isAddress(recipientAddress)) {
                alert("Please enter a valid Ethereum address.");
                return;
            }
            try {
                await distributeContract.methods.addRecipient(recipientAddress).send({ from: accounts[0] });
                alert("Recipient added successfully!");
                newRecipientAddressInput.value = '';
                getSplitterRecipients(); // Refresh list
            } catch (error) {
                console.error("Error adding recipient:", error);
                alert("Error adding recipient. Check console for details.");
            }
        }

        // --- Staking Contract Functions ---
        async function getTotalStakedAmount() {
            try {
                const totalStaked = await stakingContract.methods.getTotalStaked().call();
                console.log("Total Staked Amount:", web3.utils.fromWei(totalStaked, 'ether'));
                totalStakedAmountSpan.textContent = web3.utils.fromWei(totalStaked, 'ether');
                return web3.utils.fromWei(totalStaked, 'ether');
            } catch (error) {
                console.error("Error getting total staked amount:", error);
                totalStakedAmountSpan.textContent = 'Error loading total staked.';
                return '0';
            }
        }

        async function stake() {
            const amount = stakeAmountInput.value;
            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount to stake.");
                return;
            }
            const amountInWei = web3.utils.toWei(amount, 'ether');
            try {
                await stakingContract.methods.stake(amountInWei).send({ from: accounts[0], value: amountInWei });
                alert("Staked successfully!");
                stakeAmountInput.value = '';
                getTotalStakedAmount(); // Refresh amount
            } catch (error) {
                console.error("Error staking:", error);
                alert("Error staking. Check console for details.");
            }
        }

        // Event Listeners
        addRecipientBtn.addEventListener('click', addRecipient);
        stakeBtn.addEventListener('click', stake);

        // Call read functions on load
        getSplitterRecipients();
        getTotalStakedAmount();

        // We'll add contract loading and interaction here later
    }
});
