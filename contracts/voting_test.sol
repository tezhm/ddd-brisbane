// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

import "remix_tests.sol";
import "remix_accounts.sol";
import "../contracts/Voting.sol";

contract VotingTest {
    Voting testClass;

    function beforeAll() public {
        testClass = new Voting();
    }

    function testCreatePoll() public {
        Voting.Option[] memory opts = new Voting.Option[](2);
        opts[0] = Voting.Option("Option 1", "Description 1");
        opts[1] = Voting.Option("Option 2", "Description 2");

        uint pollIndex = testClass.openPoll("My Poll", opts);
        (address creator,
            string memory title,
            Voting.Option[] memory options,
            Voting.Vote[] memory votes,
            bool isOpen) = testClass.getPoll(pollIndex);

        Assert.equal(0, pollIndex, "Should be first poll");
        Assert.equal(creator, address(this), "Creator should be test contract");
        Assert.equal(title, "My Poll", "Poll title mismatch");
        Assert.equal(options.length, 2, "Length must be two");
        Assert.equal(options[0].title, opts[0].title, "Options must equal");
        Assert.equal(options[0].description, opts[0].description, "Options must equal");
        Assert.equal(options[1].title, opts[1].title, "Options must equal");
        Assert.equal(options[1].description, opts[1].description, "Options must equal");
        Assert.equal(votes.length, 0, "Should be no votes");
        Assert.ok(isOpen, "Should be open");
    }

    function testVote() public {
        Voting.Option[] memory opts = new Voting.Option[](2);
        opts[0] = Voting.Option("Option 1", "Description 1");
        opts[1] = Voting.Option("Option 2", "Description 2");

        uint pollIndex = testClass.openPoll("My Poll", opts);
        testClass.castVote(pollIndex, 1);

        (address creator,
            string memory title,
            Voting.Option[] memory options,
            Voting.Vote[] memory votes,
            bool isOpen) = testClass.getPoll(pollIndex);
        Assert.equal(votes.length, 1, "Should have one vote");
        Assert.equal(votes[0].voter, address(this), "We should be voter");
        Assert.equal(votes[0].optionIndex, 1, "Should be the option we specified");
    }
}
