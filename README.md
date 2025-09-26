# Staking and Distribute Contracts

This repository contains the smart contracts for staking and token distribution.

## Contracts

- `DistributeContract/Splitter.sol`: Handles token distribution logic.
- `StakingContract/Rebase.sol`: Manages token staking and rebase mechanics.

### DistributeContract (Splitter.sol) Usage Example

The `Splitter.sol` contract is designed to distribute a specific `rewardToken` to users who have staked tokens via the `Rebase.sol` contract and linked to this `Splitter` as their application.

#### Key Features:
- **Reward Token Distribution**: Authorized distributors can send `rewardToken` to the contract for proportional distribution.
- **Stake Tracking**: Integrates with a `StakeTracker` to record user stakes and reward distributions over time.
- **Claiming Rewards**: Users can claim their accumulated rewards based on their proportional stake at each distribution snapshot.

#### Example Scenario:

Imagine a project where users stake `USDC` tokens in the `Rebase` contract and receive `PROJECT_TOKEN` as rewards distributed by the `Splitter` contract.

1.  **Deployment**:
    - Deploy `Rebase.sol`.
    - Deploy `Splitter.sol` with `stakeToken` (e.g., `USDC` address) and `rewardToken` (e.g., `PROJECT_TOKEN` address) as constructor arguments.

2.  **Admin Setup**:
    - The owner of the `Splitter` contract adds a distributor address:
        ```solidity
        Splitter.addDistributor(YOUR_DISTRIBUTOR_ADDRESS);
        ```

3.  **User Staking (via Rebase)**:
    - User approves `Rebase` to spend their `USDC`:
        ```solidity
        IERC20(USDC_ADDRESS).approve(REBASE_CONTRACT_ADDRESS, AMOUNT_TO_STAKE);
        ```
    - User stakes `USDC`, linking to the `Splitter` contract:
        ```solidity
        Rebase.stake(USDC_ADDRESS, AMOUNT_TO_STAKE, SPLITTER_CONTRACT_ADDRESS);
        ```

4.  **Reward Distribution (by Distributor)**:
    - Distributor approves `Splitter` to spend `PROJECT_TOKEN`:
        ```solidity
        IERC20(PROJECT_TOKEN_ADDRESS).approve(SPLITTER_CONTRACT_ADDRESS, AMOUNT_OF_REWARD);
        ```
    - Distributor calls `split` to distribute rewards:
        ```solidity
        Splitter.split(AMOUNT_OF_REWARD);
        ```

5.  **User Claiming Rewards**:
    - User checks their unclaimed earnings:
        ```solidity
        Splitter.getUnclaimedEarnings(USER_ADDRESS, 100); // 100 is max snapshots to process
        ```
    - User claims their `PROJECT_TOKEN` rewards:
        ```solidity
        Splitter.claim(USER_ADDRESS, 100);
        ```

This flow demonstrates how `Splitter.sol` facilitates the distribution of rewards to stakers, integrated seamlessly with the `Rebase.sol` contract.
