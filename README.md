# Staking and Distribution Contracts

This repository contains two core Solidity smart contracts: `Rebase.sol` (Staking Contract) and `Splitter.sol` (Distribution Contract), along with a helper contract `StakeTracker.sol`. These contracts work together to enable users to stake various ERC20 tokens (and ETH) and receive rewards distributed by authorized entities.

## Mechanism Explanation

### 1. Rebase Contract (`Rebase.sol`)

The `Rebase` contract serves as the primary staking hub. It allows users to stake ERC20 tokens or ETH, and in return, they receive a corresponding amount of "reTokens" (rebasing tokens).

*   **Staking Tokens:** Users can stake any ERC20 token or native ETH (which is converted to WETH internally). When tokens are staked, the `Rebase` contract interacts with a dynamically created `ReToken` contract specific to the staked token. This `ReToken` contract then mints new `reTokens` to the user, representing their staked position.
*   **Dynamic `ReToken` Creation:** For each unique token staked, the `Rebase` contract deploys a minimal proxy (`cloneDeterministic`) of the `ReToken` contract. This ensures that each staked token has its own dedicated `reToken` that tracks its rebasing logic.
*   **Application Integration:** The `Rebase` contract allows for integration with various "applications" (represented by smart contract addresses). When a user stakes, they specify an `app` address. The `Rebase` contract then calls the `onStake` function on the specified `app` contract, notifying it of the new stake.
*   **Unstaking Tokens:** Users can unstake their tokens, which involves burning the `reTokens` and transferring the original staked tokens back to the user. Similarly, the `onUnstake` function on the `app` contract is called.
*   **Restaking Tokens:** Users can transfer their staked position from one application to another without fully unstaking and restaking.

### 2. Splitter Contract (`Splitter.sol`)

The `Splitter` contract is responsible for receiving reward tokens and distributing them proportionally to users who have staked through the `Rebase` contract and linked to this `Splitter` as their `app`.

*   **Reward Token:** The `Splitter` contract is initialized with a specific `rewardToken` (an ERC20 token) that it will distribute.
*   **Distributors:** Only authorized `distributors` (addresses added by the contract owner) can send `rewardToken` to the `Splitter` contract for distribution.
*   **`StakeTracker` Integration:** The `Splitter` contract uses a `StakeTracker` contract to keep track of user stakes and reward distributions over time.
    *   When a `distributor` sends `rewardToken` via the `split` function, the `Splitter` records this reward in the `StakeTracker` by creating a "snapshot." This snapshot captures the total supply of staked tokens at that moment and the amount of reward distributed.
    *   When users stake or unstake via the `Rebase` contract, the `Splitter` (as an `app` of `Rebase`) receives `onStake` and `onUnstake` calls, and updates the `StakeTracker` accordingly.
*   **Claiming Rewards:** Users can `claim` their accumulated rewards. The `claim` function calculates a user's share of rewards based on their proportional stake at each snapshot when rewards were distributed. It then transfers the `rewardToken` to the user. To prevent excessive gas usage, users can specify a `limit` on the number of snapshots considered in a single claim transaction.

### 3. StakeTracker Contract (`StakeTracker.sol`)

The `StakeTracker` contract is a specialized ERC20Snapshot token that acts as a ledger for tracking user stakes and reward allocations.

*   **ERC20Snapshot:** It extends OpenZeppelin's `ERC20Snapshot`, allowing it to record balances and total supply at specific points in time (snapshots).
*   **Tracking Rewards:** It maps snapshot IDs to the `rewardQuantity` received by the `Splitter` at that snapshot.
*   **Calculating User Rewards:** The `getUserReward` function calculates a user's proportional share of rewards for a given snapshot by comparing their `balanceOfAt` (their stake at that snapshot) to the `totalSupplyAt` (total staked supply at that snapshot).

## Usage Instructions

### Deployment

1.  **Deploy `Rebase.sol`:** Deploy the `Rebase` contract. Note the address of the deployed `Rebase` contract.
    *   Example on BaseScan: [0x89fA20b30a88811FBB044821FEC130793185c60B](https://basescan.org/address/0x89fa20b30a88811fbb044821fec130793185c60b)
2.  **Deploy `Splitter.sol`:** Deploy the `Splitter` contract, providing the `stakeToken` (the token users will stake) and `rewardToken` (the token that will be distributed as rewards) addresses as constructor arguments.
    *   Example on BaseScan: [0x6bc86cb06db133e939cc9d3cd27b6b34772dd0cb](https://basescan.org/address/0x6bc86cb06db133e939cc9d3cd27b6b34772dd0cb)

### Staking Tokens (via `Rebase` contract)

To stake ERC20 tokens:

1.  Approve the `Rebase` contract to spend your ERC20 tokens:
    ```solidity
    IERC20(YOUR_TOKEN_ADDRESS).approve(REBASE_CONTRACT_ADDRESS, AMOUNT_TO_STAKE);
    ```
2.  Call the `stake` function on the `Rebase` contract:
    ```solidity
    Rebase.stake(YOUR_TOKEN_ADDRESS, AMOUNT_TO_STAKE, SPLITTER_CONTRACT_ADDRESS);
    ```
    (Replace `YOUR_TOKEN_ADDRESS`, `AMOUNT_TO_STAKE`, and `SPLITTER_CONTRACT_ADDRESS` with actual values.)

To stake ETH:

1.  Call the `stakeETH` function on the `Rebase` contract, sending the desired ETH amount:
    ```solidity
    Rebase.stakeETH(SPLITTER_CONTRACT_ADDRESS) payable; // send value with the transaction
    ```
    (Replace `SPLITTER_CONTRACT_ADDRESS` with the actual value.)

### Unstaking Tokens (via `Rebase` contract)

To unstake ERC20 tokens:

```solidity
Rebase.unstake(YOUR_TOKEN_ADDRESS, AMOUNT_TO_UNSTAKE, SPLITTER_CONTRACT_ADDRESS);
```

To unstake ETH:

```solidity
Rebase.unstakeETH(AMOUNT_TO_UNSTAKE, SPLITTER_CONTRACT_ADDRESS);
```

### Distributing Rewards (via `Splitter` contract)

Only approved distributors can perform this action.

1.  The owner of the `Splitter` contract must add your address as a distributor:
    ```solidity
    Splitter.addDistributor(YOUR_DISTRIBUTOR_ADDRESS);
    ```
2.  Approve the `Splitter` contract to spend the reward tokens from your distributor address:
    ```solidity
    IERC20(REWARD_TOKEN_ADDRESS).approve(SPLITTER_CONTRACT_ADDRESS, AMOUNT_OF_REWARD);
    ```
3.  Call the `split` function on the `Splitter` contract to distribute rewards:
    ```solidity
    Splitter.split(AMOUNT_OF_REWARD);
    ```

### Claiming Rewards (via `Splitter` contract)

Any user can claim their earned rewards.

```solidity
Splitter.claim(YOUR_RECEIVING_ADDRESS, MAX_SNAPSHOTS_TO_PROCESS);
```
(Replace `YOUR_RECEIVING_ADDRESS` with the address where you want to receive the rewards, and `MAX_SNAPSHOTS_TO_PROCESS` with a reasonable number to avoid gas limits, e.g., 50 or 100.)

You can check your unclaimed earnings before claiming:

```solidity
Splitter.getUnclaimedEarnings(YOUR_ADDRESS, MAX_SNAPSHOTS_TO_PROCESS);
```

### 4. Pause/Unpause Mechanism for Reward Distribution

This new feature introduces the ability for the contract owner to temporarily pause and unpause reward distribution within the `Splitter` contract. This can be crucial for maintenance, upgrades, or in emergency situations to prevent unexpected token transfers.

*   **`pause()`:** The owner can call this function to halt all reward distribution (`split`) and claiming (`claim`) operations.
*   **`unpause()`:** The owner can call this function to resume reward distribution and claiming operations.

### 5. Reward Fee Mechanism

To support operational costs or other initiatives, a configurable fee mechanism has been added to the `Splitter` contract. A percentage of distributed rewards can be automatically deducted and sent to a designated fee recipient.

*   **`_feePercentage`:** A state variable (e.g., `100` for 1%, `500` for 5%) defining the percentage of rewards to be taken as a fee. The value is out of 10000 (meaning 100% = 10000).
*   **`_feeRecipient`:** The address that will receive the deducted fees.
*   **`setFeePercentage(uint256 newFeePercentage)`:** Only the owner can call this to update the fee percentage. The new percentage cannot exceed 10000 (100%).
*   **`setFeeRecipient(address newFeeRecipient)`:** Only the owner can call this to set or update the fee recipient address.
*   **Fee Deduction in `split()`:** When rewards are split, the contract automatically calculates the fee based on `_feePercentage` and transfers it to `_feeRecipient` before distributing the remaining rewards.

### 6. Role-Based Access Control for Distributors

The contract now uses OpenZeppelin's `AccessControlEnumerable` to manage distributor permissions, enhancing security and flexibility. Instead of a simple whitelist, distributors are assigned a `DISTRIBUTOR_ROLE`.

*   **`DEFAULT_ADMIN_ROLE`:** Automatically granted to the contract deployer, allowing management of other roles.
*   **`DISTRIBUTOR_ROLE`:** This role is required to call the `split` function.
*   **`addDistributor(address distributor)`:** An account with `DEFAULT_ADMIN_ROLE` can grant the `DISTRIBUTOR_ROLE` to a new address.
*   **`removeDistributor(address distributor)`:** An account with `DEFAULT_ADMIN_ROLE` can revoke the `DISTRIBUTOR_ROLE` from an address.
*   **`getDistributors()`:** Returns an array of all addresses currently holding the `DISTRIBUTOR_ROLE`.
