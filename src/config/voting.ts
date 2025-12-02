import { validateInt, validateString } from "../components/util/Environment";

export const voting = {
    CONTRACT_ADDRESS: validateString(import.meta.env.VITE_VOTING_CONTRACT_ADDRESS),
    CONTRACT_POLL: validateInt(import.meta.env.VITE_VOTING_CONTRACT_POLL),
    CONTRACT_ABI: [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "voter",
                    "type": "address"
                }
            ],
            "name": "AlreadyVoted",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                }
            ],
            "name": "DuplicateOption",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "creator",
                    "type": "address"
                }
            ],
            "name": "MustBeCreator",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "NoOptions",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "NoTitle",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "optionIndex",
                    "type": "uint256"
                }
            ],
            "name": "OptionDoesNotExist",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                }
            ],
            "name": "PollDoesNotExist",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                }
            ],
            "name": "PollNotOpen",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "TooManyOptions",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                }
            ],
            "name": "PollClosed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "creator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "title",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        }
                    ],
                    "indexed": false,
                    "internalType": "struct Voting.Option[]",
                    "name": "options",
                    "type": "tuple[]"
                }
            ],
            "name": "PollOpened",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "voter",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "optionIndex",
                    "type": "uint256"
                }
            ],
            "name": "VoteCasted",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "optionIndex",
                    "type": "uint256"
                }
            ],
            "name": "castVote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                }
            ],
            "name": "closePoll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                }
            ],
            "name": "getPoll",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "creator",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "title",
                            "type": "string"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "string",
                                    "name": "title",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "description",
                                    "type": "string"
                                }
                            ],
                            "internalType": "struct Voting.Option[]",
                            "name": "options",
                            "type": "tuple[]"
                        },
                        {
                            "internalType": "bool",
                            "name": "isOpen",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct Voting.Poll",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "offset",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "limit",
                    "type": "uint256"
                }
            ],
            "name": "getPolls",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "creator",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "title",
                            "type": "string"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "string",
                                    "name": "title",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "description",
                                    "type": "string"
                                }
                            ],
                            "internalType": "struct Voting.Option[]",
                            "name": "options",
                            "type": "tuple[]"
                        },
                        {
                            "internalType": "bool",
                            "name": "isOpen",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct Voting.Poll[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getPollsCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "offset",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "limit",
                    "type": "uint256"
                }
            ],
            "name": "getVotes",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "voter",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "optionIndex",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct Voting.Vote[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                }
            ],
            "name": "getVotesCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "pollIndex",
                    "type": "uint256"
                }
            ],
            "name": "getVotesTotal",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "title",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct Voting.Option[]",
                    "name": "options",
                    "type": "tuple[]"
                }
            ],
            "name": "openPoll",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],
};
