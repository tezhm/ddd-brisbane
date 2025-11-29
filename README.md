# DDD Brisbane

This is an example decentralized application (Dapp) built with **Vite** and **TypeScript** that demonstrates full **frontend interaction** with a **Lisk Sepolia** smart contract. This project showcases how to handle reading contract state, parsing event logs, sending transactions, and establishing a real-time event listener—all without a dedicated backend server.

---

## Features

* **Network Connection:** Connects directly to the **Lisk Sepolia** test network.
* **Query Current State:** Fetches the current vote counts for a running poll by reading the smart contract's state.
* **Historical Events:** Queries the blockchain for past `VoteCast` events from the contract's event log.
* **Cast Vote Transaction:** Allows users to submit a transaction to cast a vote against a poll option.
* **Real-Time Updates:** Uses a **WebSocket connection** to listen for live `VoteCast` events as they are mined, updating the UI instantly.
* **Contract Code Included:** The source code for the demonstration smart contract is included in the project for full transparency and understanding.

---

## Getting Started

### Prerequisites

You will need the following installed:

* Node.js (LTS recommended)
* npm

You will need to deploy the `contracts/Voting.sol` to Lisk Sepolia network.

You will need to create a poll (`openPoll`) on deployed contract with following arguments:

```
"Vote For Your Favorite",[["Cool Llama", "Vote for the llama whose dance moves are 100% vibe, 0% coordination, and powered entirely by untamed confidence and sunglasses."],["Inflatable Tube", "Vote for the only dancer fueled by a leaf blower, choreographed by chaos itself, and personally responsible for several nervous breakdowns in the physics department."],["Triangle Man", "Vote for the three-sided sensation proving that triangles aren’t just the strongest shape in engineering, they're also the most structurally sound on the dance floor."]]
```

### Installation

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set Environment Variables:**
    Create a file named `.env` in the project root and add your necessary environment variables. At a minimum you'll need an already deployed contract address (Voting.sol) and the poll index.

    ***.env example:***
    ```
    VITE_VOTING_CONTRACT_ADDRESS="0xEb242Acc5d54D00B67c6145fE78b7CbfFA26B797"
    VITE_VOTING_CONTRACT_POLL=3
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

| Action | Smart Contract Interaction | Lisk/EVM Tooling |
| :--- | :--- | :--- |
| **Get Current Votes** | Reading a public state variable (e.g., `getPoll(uint pollIndex)`) | `Contract.callStatic` (read-only) |
| **Cast a Vote** | Sending a mutating transaction (e.g., `castVote(uint pollIndex, uint optionIndex)`) | `Contract.connect(signer).sendTransaction` |
| **Historical Votes** | Filtering past blockchain events (e.g., `VoteCasted(uint pollIndex, address voter, uint optionIndex)`) | Provider's `getLogs` method |
| **Live Updates** | Listening for real-time events | WebSocket Provider's `on(event)` listener |

---

## Contributing

Feel free to fork this repository, submit pull requests, or open issues. Any contributions to enhance the Lisk/TypeScript integration or improve the user experience are welcome!
