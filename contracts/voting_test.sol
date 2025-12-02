// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "remix_tests.sol";
import "remix_accounts.sol";
import "../contracts/Voting.sol";

contract VotingTest {
    Voting voting;

    function beforeEach() public {
        voting = new Voting();
    }

    function testCreatePoll() public {
        string memory title = "My Test Poll";
        Voting.Option[] memory options = new Voting.Option[](2);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");

        uint pollIndex = voting.openPoll(title, options);
        Voting.Poll memory poll = voting.getPoll(pollIndex);

        Assert.equal(0, pollIndex, "Should be first poll");
        Assert.equal(poll.creator, address(this), "Creator should be test contract");
        Assert.equal(poll.title, title, "Poll title mismatch");
        Assert.equal(poll.options.length, 2, "Options length must be two");
        Assert.equal(poll.options[0].title, options[0].title, "Options 0 title mismatch");
        Assert.equal(poll.options[0].description, options[0].description, "Options 0 description mismatch");
        Assert.equal(poll.options[1].title, options[1].title, "Options 1 title mismatch");
        Assert.equal(poll.options[1].description, options[1].description, "Options 1 description mismatch");
        Assert.equal(poll.isOpen, true, "Should be open");
    }

    function testCreatePollNoTitle() public {
        Voting.Option[] memory options = new Voting.Option[](2);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");

        try voting.openPoll("", options) {
            Assert.ok(false, "Did not revert with NoTitle");
        } catch (bytes memory reason) {
            bytes4 expected = bytes4(keccak256("NoTitle()"));
            bytes4 actual = bytes4(reason);
            Assert.equal(actual, expected, "Reverted with unexpected error");
        }
    }

    function testCreatePollNoOptions() public {
        string memory title = "My Test Poll";

        try voting.openPoll(title, new Voting.Option[](0)) {
            Assert.ok(false, "Did not revert with NoOptions");
        } catch (bytes memory reason) {
            bytes4 expected = bytes4(keccak256("NoOptions()"));
            bytes4 actual = bytes4(reason);
            Assert.equal(actual, expected, "Reverted with unexpected error");
        }
    }

    function testCreatePollTooManyOptions() public {
        string memory title = "My Test Poll";
        Voting.Option[] memory options = new Voting.Option[](11);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");
        options[2] = Voting.Option("Option 3", "Description 3");
        options[3] = Voting.Option("Option 4", "Description 4");
        options[4] = Voting.Option("Option 5", "Description 5");
        options[5] = Voting.Option("Option 6", "Description 6");
        options[6] = Voting.Option("Option 7", "Description 7");
        options[7] = Voting.Option("Option 8", "Description 8");
        options[8] = Voting.Option("Option 9", "Description 9");
        options[9] = Voting.Option("Option 10", "Description 10");
        options[10] = Voting.Option("Option 11", "Description 11");

        try voting.openPoll(title, options) {
            Assert.ok(false, "Did not revert with TooManyOptions");
        } catch (bytes memory reason) {
            bytes4 expected = bytes4(keccak256("TooManyOptions()"));
            bytes4 actual = bytes4(reason);
            Assert.equal(actual, expected, "Reverted with unexpected error");
        }
    }

    function testCreatePollDuplicateOption() public {
        string memory title = "My Test Poll";
        Voting.Option[] memory options = new Voting.Option[](3);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");
        options[2] = Voting.Option("Option 1", "Description 3");

        try voting.openPoll(title, options) {
            Assert.ok(false, "Did not revert with DuplicateOption");
        } catch (bytes memory reason) {
            bytes4 expected = bytes4(keccak256("DuplicateOption(string)"));
            bytes4 actual = bytes4(reason);
            Assert.equal(actual, expected, "Reverted with unexpected error");
        }
    }

    function testVote() public {
        string memory title = "My Test Poll";
        Voting.Option[] memory options = new Voting.Option[](2);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");
        uint pollIndex = voting.openPoll(title, options);

        voting.castVote(pollIndex, 1);

        uint votesCount = voting.getVotesCount(pollIndex);
        Assert.equal(votesCount, 1, "Should have one vote");
        Voting.Vote[] memory votes = voting.getVotes(pollIndex, 0, 100);
        Assert.equal(votes.length, 1, "Should have one vote");
        Assert.equal(votes[0].voter, address(this), "We should be voter");
        Assert.equal(votes[0].optionIndex, 1, "Should be the option we specified");
    }

    function testVotePollDoesNotExist() public {
        string memory title = "My Test Poll";
        Voting.Option[] memory options = new Voting.Option[](2);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");
        uint pollIndex = voting.openPoll(title, options);

        try voting.castVote(pollIndex + 1, 1) {
            Assert.ok(false, "Did not revert with PollDoesNotExist");
        } catch (bytes memory reason) {
            bytes4 expected = bytes4(keccak256("PollDoesNotExist(uint256)"));
            bytes4 actual = bytes4(reason);
            Assert.equal(actual, expected, "Reverted with unexpected error");
        }
    }

    function testVoteOptionDoesNotExist() public {
        string memory title = "My Test Poll";
        Voting.Option[] memory options = new Voting.Option[](2);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");
        uint pollIndex = voting.openPoll(title, options);

        try voting.castVote(pollIndex, 2) {
            Assert.ok(false, "Did not revert with OptionDoesNotExist");
        } catch (bytes memory reason) {
            bytes4 expected = bytes4(keccak256("OptionDoesNotExist(uint256,uint256)"));
            bytes4 actual = bytes4(reason);
            Assert.equal(actual, expected, "Reverted with unexpected error");
        }
    }

    function testVotePollNotOpen() public {
        string memory title = "My Test Poll";
        Voting.Option[] memory options = new Voting.Option[](2);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");
        uint pollIndex = voting.openPoll(title, options);
        voting.closePoll(pollIndex);

        try voting.castVote(pollIndex, 1) {
            Assert.ok(false, "Did not revert with PollNotOpen");
        } catch (bytes memory reason) {
            bytes4 expected = bytes4(keccak256("PollNotOpen(uint256)"));
            bytes4 actual = bytes4(reason);
            Assert.equal(actual, expected, "Reverted with unexpected error");
        }
    }

    function testClosePoll() public {
        string memory title = "My Test Poll";
        Voting.Option[] memory options = new Voting.Option[](2);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");

        uint pollIndex = voting.openPoll(title, options);
        voting.closePoll(pollIndex);

        Voting.Poll memory poll = voting.getPoll(pollIndex);
        Assert.equal(0, pollIndex, "Should be first poll");
        Assert.equal(poll.creator, address(this), "Creator should be test contract");
        Assert.equal(poll.title, title, "Poll title mismatch");
        Assert.equal(poll.options.length, 2, "Options length must be two");
        Assert.equal(poll.options[0].title, options[0].title, "Options 0 title mismatch");
        Assert.equal(poll.options[0].description, options[0].description, "Options 0 description mismatch");
        Assert.equal(poll.options[1].title, options[1].title, "Options 1 title mismatch");
        Assert.equal(poll.options[1].description, options[1].description, "Options 1 description mismatch");
        Assert.equal(poll.isOpen, false, "Should be closed");
    }

    function testClosePollPollDoesNotExist() public {
        string memory title = "My Test Poll";
        Voting.Option[] memory options = new Voting.Option[](2);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");
        uint pollIndex = voting.openPoll(title, options);

        try voting.closePoll(pollIndex + 1) {
            Assert.ok(false, "Did not revert with PollDoesNotExist");
        } catch (bytes memory reason) {
            bytes4 expected = bytes4(keccak256("PollDoesNotExist(uint256)"));
            bytes4 actual = bytes4(reason);
            Assert.equal(actual, expected, "Reverted with unexpected error");
        }
    }

    function testGetPoll() public {
        string memory title = "My Test Poll";
        Voting.Option[] memory options = new Voting.Option[](2);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");

        uint pollIndex = voting.openPoll(title, options);
        Voting.Poll memory poll = voting.getPoll(pollIndex);

        Assert.equal(poll.creator, address(this), "Creator should be test contract");
        Assert.equal(poll.title, title, "Poll title mismatch");
        Assert.equal(poll.options.length, 2, "Options length must be two");
        Assert.equal(poll.isOpen, true, "Should be open");
    }

    function testGetPollPollDoesNotExist() public {
        try voting.getPoll(0) {
            Assert.ok(false, "Did not revert with PollDoesNotExist");
        } catch (bytes memory reason) {
            bytes4 expected = bytes4(keccak256("PollDoesNotExist(uint256)"));
            bytes4 actual = bytes4(reason);
            Assert.equal(actual, expected, "Reverted with unexpected error");
        }
    }

    function testGetPolls() public {
        string memory title1 = "Poll 1";
        string memory title2 = "Poll 2";
        Voting.Option[] memory options = new Voting.Option[](2);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");

        voting.openPoll(title1, options);
        voting.openPoll(title2, options);

        Voting.Poll[] memory polls = voting.getPolls(0, 10);
        Assert.equal(polls.length, 2, "Should have two polls");
        Assert.equal(polls[0].title, title1, "First poll title mismatch");
        Assert.equal(polls[1].title, title2, "Second poll title mismatch");
    }

    function testGetPollsWithOffset() public {
        string memory title1 = "Poll 1";
        string memory title2 = "Poll 2";
        string memory title3 = "Poll 3";
        Voting.Option[] memory options = new Voting.Option[](2);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");

        voting.openPoll(title1, options);
        voting.openPoll(title2, options);
        voting.openPoll(title3, options);

        Voting.Poll[] memory polls = voting.getPolls(1, 10);
        Assert.equal(polls.length, 2, "Should have two polls");
        Assert.equal(polls[0].title, title2, "First poll title mismatch");
        Assert.equal(polls[1].title, title3, "Second poll title mismatch");
    }

    function testGetPollsCount() public {
        string memory title = "My Test Poll";
        Voting.Option[] memory options = new Voting.Option[](2);
        options[0] = Voting.Option("Option 1", "Description 1");
        options[1] = Voting.Option("Option 2", "Description 2");

        uint count1 = voting.getPollsCount();
        Assert.equal(count1, 0, "Should have zero polls initially");

        voting.openPoll(title, options);
        uint count2 = voting.getPollsCount();
        Assert.equal(count2, 1, "Should have one poll");

        voting.openPoll(title, options);
        uint count3 = voting.getPollsCount();
        Assert.equal(count3, 2, "Should have two polls");
    }
}
