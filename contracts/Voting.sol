// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Option {
        string title;
        string description;
    }

    struct Poll {
        address creator;
        string title;
        Option[] options;
        bool isOpen;
    }

    struct Vote {
        address voter;
        uint optionIndex;
    }

    struct Votes {
        mapping(address => bool) hasVoted;
        mapping(uint => uint) voteTotals;
        Vote[] votes;
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
    error PollNotOpen(uint pollIndex);
    error AlreadyVoted(uint pollIndex, address voter);

    // Storing polls and votes separately and matching by index (should always be same size)
    // Makes things easier on query side
    Poll[] private _polls;
    Votes[] private _votes;

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

        // Need to push because Poll struct contains a dynamically sized array which can only be declared in contract scope
        _polls.push();
        // Same with votes which also includes mapping types
        _votes.push();
        uint pollIndex = _polls.length - 1;
        Poll storage poll = _polls[pollIndex];
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
        Votes storage votes = _getVotes(pollIndex);

        if (optionIndex >= poll.options.length) {
            revert OptionDoesNotExist(pollIndex, optionIndex);
        }

        if (!poll.isOpen) {
            revert PollNotOpen(pollIndex);
        }

        if (votes.hasVoted[msg.sender]) {
            revert AlreadyVoted(pollIndex, msg.sender);
        }

        votes.votes.push(Vote(msg.sender, optionIndex));
        ++votes.voteTotals[optionIndex];
        votes.hasVoted[msg.sender] = true;
        emit VoteCasted(pollIndex, msg.sender, optionIndex);
    }

    function closePoll(uint pollIndex) external {
        Poll storage poll = _getPoll(pollIndex);

        if (poll.creator != msg.sender) {
            revert MustBeCreator(pollIndex, poll.creator);
        }

        if (!poll.isOpen) {
            revert PollNotOpen(pollIndex);
        }

        poll.isOpen = false;
        emit PollClosed(pollIndex);
    }

    function getPoll(uint pollIndex) external view returns (Poll memory) {
        return _getPoll(pollIndex);
    }

    function getPolls(uint offset, uint limit) external view returns (Poll[] memory) {
        uint total = _polls.length;

        if (offset >= total) {
            return new Poll[](0);
        }

        uint remaining = total - offset;
        uint count = remaining < limit ? remaining : limit;
        Poll[] memory result = new Poll[](count);

        for (uint i = 0; i < count; ++i) {
            result[i] = _polls[offset + i];
        }

        return result;
    }

    function getPollsCount() external view returns (uint) {
        return _polls.length;
    }

    function getVotes(uint pollIndex, uint offset, uint limit) external view returns (Vote[] memory) {
        Votes storage votes = _getVotes(pollIndex);
        uint total = votes.votes.length;

        if (offset >= total) {
            return new Vote[](0);
        }

        uint remaining = total - offset;
        uint count = remaining < limit ? remaining : limit;
        Vote[] memory result = new Vote[](count);

        for (uint i = 0; i < count; ++i) {
            result[i] = votes.votes[offset + i];
        }

        return result;
    }

    function getVotesCount(uint pollIndex) external view returns (uint) {
        Votes storage votes = _getVotes(pollIndex);
        return votes.votes.length;
    }

    function getVotesTotal(uint pollIndex) external view returns (uint[] memory) {
        Poll storage poll = _getPoll(pollIndex);
        Votes storage votes = _getVotes(pollIndex);
        uint[] memory totals = new uint[](poll.options.length);

        for (uint i = 0; i < poll.options.length; ++i) {
            totals[i] = votes.voteTotals[i];
        }

        return totals;
    }

    function _getPoll(uint pollIndex) private view returns (Poll storage) {
        if (pollIndex >= _polls.length) {
            revert PollDoesNotExist(pollIndex);
        }

        return _polls[pollIndex];
    }

    function _getVotes(uint pollIndex) private view returns (Votes storage) {
        if (pollIndex >= _votes.length) {
            revert PollDoesNotExist(pollIndex);
        }

        return _votes[pollIndex];
    }
}
