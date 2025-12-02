# DDD Brisbane

This is an example Web3 dApp built with **Vite** and **TypeScript** that demonstrates **frontend interaction** with a **Lisk Sepolia** smart contract. This project showcases how to handle reading contract state, parsing event logs, sending transactions, and establishing a real-time event listener.

---

## Features

* **Network Connection:** Connects directly to the **Lisk Sepolia** test network from browser
* **Query Current State:** Fetches the current vote counts for a running poll by reading the smart contract's state
* **Historical Events:** Queries the blockchain for past `VoteCasted` events from the contract's event log
* **Cast Vote Transaction:** Allows users to submit a transaction to cast a vote against a poll option
* **Real-Time Updates:** Uses a **WebSocket connection** to listen for live `VoteCasted` events as they are mined, updating the UI instantly
* **Contract Code Included:** The source code for the demonstration smart contract is included in `contracts/`

---

## Getting Started

### Prerequisites

Following dependencies required to build project:

* Node.js (v25.1.0 or above)
* npm (11.6.2 or above)

### Deploying contract and opening poll

1.  **Install wallet:**
    * Add metamask (or your desired wallet) to browser
    * Metamask download: https://metamask.io/en-GB/download

2.  **Add Lisk Sepolia network:**
    * Head to https://sepolia-blockscout.lisk.com 
    * Press the `Add Lisk Sepolia Testnet` button (bottom left corner)

3.  **Get tokens:**
    * Head to https://console.optimism.io/faucet and sign in
    * Choose the `Lisk Sepolia` network and follow prompts to claim tokens

4.  **Deploy `Voting.sol`:**
    * Head to https://remix.ethereum.org
    * Copy the `contracts/Voting.sol` file from this project into `contracts/` directory of remix
    * Compile `Voting.sol` in remix
    * Open `Deploy & run transactions` tab
    * Choose environment: `Browser extension` -> `Injected Provider - Metamask`
    * Click on `Deploy & Verify` to deploy contract
    * Follow prompts from wallet to complete deployment of contract
    * Deployed contract should be listed under `Deployed Contracts` section in `Deploy & run transactions` tab

5.  **Open poll:**
    * Open dropdown of deployed `Voting.sol` contract in `Deploy & run transactions` tab
    * In the `openPoll()` text box copy in the following:
        ```
        "Vote For Your Favorite",[["Cool Llama", "Vote for the llama whose dance moves are 100% vibe, 0% coordination, and powered entirely by untamed confidence and sunglasses."],["Inflatable Tube", "Vote for the only dancer fueled by a leaf blower, choreographed by chaos itself, and personally responsible for several nervous breakdowns in the physics department."],["Triangle Man", "Vote for the three-sided sensation proving that triangles aren’t just the strongest shape in engineering, they're also the most structurally sound on the dance floor."]]
        ```
    * Press `openPoll()`
    * Follow prompts from wallet to complete opening of poll

### Installation

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set Environment Variables:**

    Create a file named `.env` in the project root and add following environment variables

    `VITE_VOTING_CONTRACT_ADDRESS` should be the address of deployed `Voting.sol` contract.

    `VITE_VOTING_CONTRACT_POLL` should be the `pollIndex` of poll created against given contract.

    ***.env:***
    ```
    VITE_VOTING_CONTRACT_ADDRESS="0xEb242Acc5d54D00B67c6145fE78b7CbfFA26B797"
    VITE_VOTING_CONTRACT_POLL=0
    ```

### Running the Project

1.  **Start the development server:**
    ```bash
    npx vite
    ```
2.  Open your browser to the URL displayed in the console (usually `http://localhost:3000`).

---

## Smart Contract Details

The smart contract, located in `contracts/Voting.sol`, is a basic voting mechanism. It exposes functions for creating a poll, querying the poll (including current vote totals), closing the poll, and an external function for submitting a vote.

### Key Interactions Demonstrated:

| Action                | Smart Contract Interaction                                                                            | Lisk/EVM Tooling                           |
|:----------------------|:------------------------------------------------------------------------------------------------------|:-------------------------------------------|
| **Get Poll**          | Reading a public state variable (`getPoll(uint pollIndex)`)                                           | `Contract.callStatic` (read-only)          |
| **Cast a Vote**       | Sending a mutating transaction (`castVote(uint pollIndex, uint optionIndex)`)                         | `Contract.connect(signer).sendTransaction` |
| **Historical Votes**  | Filtering past blockchain events (`VoteCasted(uint pollIndex, address voter, uint optionIndex)`)      | Provider's `getLogs` method                |
| **Live Updates**      | Listening for real-time events (`VoteCasted(uint pollIndex, address voter, uint optionIndex)`)        | WebSocket Provider's `on(event)` listener  |

---

## Contributing

Feel free to fork this repository, submit pull requests, or open issues. Any contributions to enhance the Lisk/TypeScript integration or improve the user experience are welcome!
