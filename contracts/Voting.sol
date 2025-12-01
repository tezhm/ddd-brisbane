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
        mapping(uint => uint) voteTotals;
        Vote[] votes;
        bool isOpen;
    }

    event PollOpened(uint pollIndex, address creator, string title, Option[] options);
    event VoteCasted(uint pollIndex, address voter, uint optionIndex);
    event PollClosed(uint pollIndex);

    error NoTitle();
    error NoOptions();
    error TooManyOptions();
    error DuplicateOption(string title);
    error PollDoesNotExist(uint pollIndex);
    error MustBeCreator(uint pollIndex, address creator);
    error OptionDoesNotExist(uint pollIndex, uint optionIndex);
    error PollAlreadyClosed(uint pollIndex);
    error AlreadyVoted(uint pollIndex, address voter);

    Poll[] private polls;

    function openPoll(string calldata title, Option[] calldata options) external returns (uint) {
        if (bytes(title).length == 0) {
            revert NoTitle();
        }

        if (options.length == 0) {
            revert NoOptions();
        }

        if (options.length > 10) {
            revert TooManyOptions();
        }

        // Basic duplicate option detection (checking unique titles)
        for (uint i = 0; i < options.length; ++i) {
            for (uint j = i + 1; j < options.length; ++j) {
                // Directly comparing strings only compares their reference and not content so comparing hashes instead
                // Alternative is iterating over bytes of both strings and comparing each byte
                if (keccak256(bytes(options[i].title)) == keccak256(bytes(options[j].title))) {
                    revert DuplicateOption(options[i].title);
                }
            }
        }

        // Need to push because Poll struct contains a mapping which can only be declared in contract scope
        polls.push();
        uint pollIndex = polls.length - 1;
        Poll storage poll = polls[pollIndex];
        poll.creator = msg.sender;
        poll.title = title;
        poll.isOpen = true;

        // Getting around --via-ir flag not provided to compiler (can't copy from calldata to storage without it)
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

        if (!poll.isOpen) {
            revert PollAlreadyClosed(pollIndex);
        }

        if (poll.hasVoted[msg.sender]) {
            revert AlreadyVoted(pollIndex, msg.sender);
        }

        poll.votes.push(Vote(msg.sender, optionIndex));
        ++poll.voteTotals[optionIndex];
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

    function getPoll(uint pollIndex) external view returns (address creator, string memory title, Option[] memory options, bool isOpen) {
        Poll storage poll = _getPoll(pollIndex);
        return (poll.creator, poll.title, poll.options, poll.isOpen);
    }

    function getVotes(uint pollIndex, uint offset, uint limit) external view returns (Vote[] memory) {
        Poll storage poll = _getPoll(pollIndex);
        uint total = poll.votes.length;

        if (offset >= total) {
            return new Vote[](0);
        }

        uint remaining = total - offset;
        uint count = remaining < limit ? remaining : limit;
        Vote[] memory votes = new Vote[](count);

        for (uint i = 0; i < count; ++i) {
            votes[i] = poll.votes[offset + i];
        }

        return votes;
    }

    function getVotesCount(uint pollIndex) external view returns (uint) {
        Poll storage poll = _getPoll(pollIndex);
        return poll.votes.length;
    }

    function getVotesTotal(uint pollIndex) external view returns (uint[] memory) {
        Poll storage poll = _getPoll(pollIndex);
        uint[] memory totals = new uint[](poll.options.length);

        for (uint i = 0; i < poll.options.length; ++i) {
            totals[i] = poll.voteTotals[i];
        }

        return totals;
    }

    function _getPoll(uint pollIndex) private view returns (Poll storage) {
        if (pollIndex >= polls.length) {
            revert PollDoesNotExist(pollIndex);
        }

        return polls[pollIndex];
    }
}
