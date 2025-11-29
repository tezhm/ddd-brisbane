// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Option {
        string title;
        string description;
    }

    struct Vote {
        address voter;
        uint optionIndex;
    }

    struct Poll {
        address creator;
        string title;
        Option[] options;
        mapping(address => bool) hasVoted;
        Vote[] votes;
        bool isOpen;
    }

    event PollOpened(uint pollIndex, address creator, string title, Option[] options);
    event VoteCasted(uint pollIndex, address voter, uint optionIndex);
    event PollClosed(uint pollIndex);

    error PollDoesNotExist(uint pollIndex);
    error MustBeCreator(uint pollIndex, address creator);
    error OptionDoesNotExist(uint pollIndex, uint creator);
    error PollAlreadyClosed(uint pollIndex);
    error AlreadyVoted(uint pollIndex, address voter);

    Poll[] private polls;

    function openPoll(string calldata title, Option[] calldata options) external returns (uint) {
        polls.push();
        uint pollIndex = polls.length - 1;
        Poll storage poll = polls[pollIndex];
        poll.creator = msg.sender;
        poll.title = title;
        poll.isOpen = true;

        for (uint i = 0; i < options.length; ++i) {
            poll.options.push(options[i]);
        }

        emit PollOpened(pollIndex, poll.creator, poll.title, poll.options);

        return pollIndex;
    }

    function castVote(uint pollIndex, uint optionIndex) external {
        Poll storage poll = _getPoll(pollIndex);

        if (optionIndex >= poll.options.length) {
            revert OptionDoesNotExist(pollIndex, optionIndex);
        }

        if (poll.hasVoted[msg.sender]) {
            revert AlreadyVoted(pollIndex, msg.sender);
        }

        if (!poll.isOpen) {
            revert PollAlreadyClosed(pollIndex);
        }

        poll.votes.push(Vote(msg.sender, optionIndex));
        poll.hasVoted[msg.sender] = true;
        emit VoteCasted(pollIndex, msg.sender, optionIndex);
    }

    function closePoll(uint pollIndex) external {
        Poll storage poll = _getPoll(pollIndex);

        if (poll.creator != msg.sender) {
            revert MustBeCreator(pollIndex, poll.creator);
        }

        if (!poll.isOpen) {
            revert PollAlreadyClosed(pollIndex);
        }

        poll.isOpen = false;
        emit PollClosed(pollIndex);
    }

    function getPoll(uint pollIndex) external view returns(address creator, string memory title, Option[] memory options, Vote[] memory votes, bool isOpen) {
        Poll storage poll = _getPoll(pollIndex);
        return (poll.creator, poll.title, poll.options, poll.votes, poll.isOpen);
    }

    function _getPoll(uint pollIndex) private view returns (Poll storage) {
        if (pollIndex >= polls.length) {
            revert PollDoesNotExist(pollIndex);
        }

        return polls[pollIndex];
    }
}
