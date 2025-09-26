# Staking and Distribute Contracts

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository houses the essential smart contracts for a decentralized application focused on token staking and distribution. It includes two primary contracts: `Splitter.sol` for managing token distribution and `Rebase.sol` for handling staking and rebase mechanics.

This documentation is intended for developers, auditors, and users interested in understanding and interacting with the contracts.

## Table of Contents

- [Contracts](#contracts)
- [DistributeContract (Splitter.sol) Usage Example](#distributecontract-splittersol-usage-example)
- [StakingContract (Rebase.sol) Usage Example](#stakingcontract-rebase.sol-usage-example)
- [Security Considerations](#security-considerations)
- [Development](#development)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [External Links](#external-links)

## Contracts

- [`DistributeContract/Splitter.sol`](DistributeContract/Splitter.sol): Manages token distribution to stakers.
- [`StakingContract/Rebase.sol`](StakingContract/Rebase.sol): Facilitates token staking and rebase mechanisms.

### DistributeContract (Splitter.sol) Usage Example

The `Splitter.sol` contract is designed to distribute a specific `rewardToken` to users who have staked tokens via the `Rebase.sol` contract and linked to this `Splitter` as their application.

#### Dependencies

This contract relies on `Rebase.sol` for staking integration and standard OpenZeppelin contracts for ERC20 functionalities.

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

### Security Considerations

Smart contracts are highly susceptible to vulnerabilities. Thorough auditing and testing are crucial before deployment to a production environment. Users should always exercise caution and understand the risks involved.

### StakingContract (Rebase.sol) Usage Example

The `Rebase.sol` contract acts as the primary staking hub, enabling users to stake various ERC20 tokens (and ETH) and receive rebasing tokens (`reTokens`) in return. It also facilitates integration with different applications, such as the `Splitter` contract for reward distribution.

#### Dependencies

This contract uses OpenZeppelin's `ERC20` and `WETH` interfaces, and interacts with `Splitter.sol` for application-specific logic.

#### Key Features:
- **Multi-Token Staking**: Supports staking of any ERC20 token and native ETH (wrapped internally to WETH).
- **Dynamic `reToken` Creation**: For each unique staked token, a dedicated `reToken` contract is deployed to manage rebasing logic.
- **Application Integration**: Allows integration with external applications (like `Splitter`) via `onStake` and `onUnstake` callbacks.
- **Unstaking and Restaking**: Provides functionalities for users to unstake their tokens and to transfer staked positions between applications.

#### Example Scenario:

To illustrate the functionality of the `Rebase.sol` contract:

Consider a dApp where users stake `DAI` tokens to earn benefits, and a `Splitter` contract is used as an application to distribute rewards.

1.  **Deployment**:
    - Deploy `Rebase.sol`. Note its address.
    - (Optional: Deploy `Splitter.sol` if it's the target application, as described in the `DistributeContract` example).

2.  **User Staking ERC20 Tokens**:
    - User approves the `Rebase` contract to spend their `DAI` tokens:
        ```solidity
        IERC20(DAI_ADDRESS).approve(REBASE_CONTRACT_ADDRESS, AMOUNT_TO_STAKE);
        ```
    - User stakes `DAI`, specifying the target application (e.g., `SPLITTER_CONTRACT_ADDRESS`):
        ```solidity
        Rebase.stake(DAI_ADDRESS, AMOUNT_TO_STAKE, APPLICATION_CONTRACT_ADDRESS); // APPLICATION_CONTRACT_ADDRESS could be Splitter.sol
        ```

3.  **User Staking ETH**:
    - User calls `stakeETH` on `Rebase`, sending the desired ETH amount:
        ```solidity
        Rebase.stakeETH(APPLICATION_CONTRACT_ADDRESS) payable; // send value with the transaction
        ```

4.  **User Unstaking ERC20 Tokens**:
    - User unstakes `DAI` from a specific application:
        ```solidity
        Rebase.unstake(DAI_ADDRESS, AMOUNT_TO_UNSTAKE, APPLICATION_CONTRACT_ADDRESS);
        ```

5.  **User Unstaking ETH**:
    - User unstakes ETH from a specific application:
        ```solidity
        Rebase.unstakeETH(AMOUNT_TO_UNSTAKE, APPLICATION_CONTRACT_ADDRESS);
        ```

6.  **User Restaking (Transferring Staked Position)**:
    - User transfers their staked `DAI` from one application (`APP_A`) to another (`APP_B`):
        ```solity
        Rebase.restake(DAI_ADDRESS, AMOUNT_TO_RESTAKE, APP_A_ADDRESS, APP_B_ADDRESS);
        ```

This example illustrates the core functionalities of `Rebase.sol` for managing token staking and its flexible integration with various decentralized applications.

### Development

To set up the development environment, ensure you have Node.js and Hardhat installed. Follow typical Hardhat project setup for compilation and testing. Comprehensive tests are located in the `test/` directory.

### License

This project is licensed under the MIT License.

### Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests. Ensure your code adheres to the project's established style guidelines.

### Acknowledgements

- OpenZeppelin for foundational smart contract libraries.

### External Links

- [Project Website](https://example.com) (Coming Soon)
- [Block Explorer](https://etherscan.io/address/0x...) (Example address, replace with actual deployment)