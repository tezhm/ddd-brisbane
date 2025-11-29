import React, { useCallback, useEffect, useState } from "react"
import { getAbiItem } from "viem";
import { useReadContract, usePublicClient, useWatchContractEvent } from "wagmi";
import AOS from "aos";
import "aos/dist/aos.css";
import inflatableLottie from "../../assets/inflatable-tube-man.json";
import llamaLottie from "../../assets/llama.json";
import triangleLottie from "../../assets/triangle-man.json";
import { voting } from "../../config/voting.ts";
import { ConnectWallet } from "../elements/ConnectWallet.tsx";
import { VotingResults } from "../elements/VotingResults.tsx";
import { type Option, VotingCard } from "../elements/VotingCard.tsx";
import { type VoteEvent, VotingTimeline } from "../elements/VotingTimeline.tsx";
import { useWallet } from "../hooks/Wallet.tsx";
import { TransactionDialog } from "../elements/TransactionDialog.tsx";
import { type Address, TransactionState } from "../elements/types.ts";

export const Home: React.FC = () => {
    const [title, setTitle] = useState<string|null>(null);
    const [options, setOptions] = useState<Option[]|null>(null);
    const [votingOpen, setVotingOpen] = useState<boolean|null>(null);
    const [votes, setVotes] = useState<Record<number, number>|null>(null);
    const [events, setEvents] = useState<VoteEvent[]|null>(null);
    const [hasVoted, setHasVoted] = useState<boolean>(false);
    const [votedOption, setVotedOption] = useState<number|null>(null);
    const [castingVote, setCastingVote] = useState(false);
    const publicClient = usePublicClient();
    const { address, castVote, castVoteState } = useWallet();
    const { data: poll, isPending, error } = useReadContract({
        address: voting.CONTRACT_ADDRESS as Address,
        abi: voting.CONTRACT_ABI,
        functionName: "getPoll",
        args: [voting.CONTRACT_POLL],
    });

    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
        });
    }, []);

    const getImage = (title: string): any => {
        const lowered = title.toLowerCase()

        if (lowered.includes("cool llama")) {
            return llamaLottie;
        }

        if (lowered.includes("inflatable tube")) {
            return inflatableLottie;
        }

        if (lowered.includes("triangle man")) {
            return triangleLottie;
        }

        throw Error(`Unsupported voting option ${title}`);
    };

    useEffect(() => {
        if (!address) {
            setHasVoted(false);
            setVotedOption(null);
        }
    }, [address]);

    useEffect(() => {
        if (isPending || error || !poll || title) {
            return;
        }

        setTitle(poll[1] as string);
        setOptions(poll[2].map((option, index) => ({
            optionIndex: index,
            title: option["title"],
            description: option["description"],
            lottieUrl: getImage(option["title"]),
        })));
        setVotes(poll[3].reduce((acc: Record<number, number>, current: { voter: string, optionIndex: number }) => {
            const optionIndex = Number(current.optionIndex);

            if (!(optionIndex in acc)) {
                acc[optionIndex] = 0;
            }

            if (address?.toLowerCase() === current.voter.toLowerCase()) {
                console.log("found it")
                console.log(optionIndex)
                setHasVoted(true);
                setVotedOption(optionIndex);
            }

            acc[optionIndex] += 1;
            return acc;
        }, {}));
        setVotingOpen(poll[4]);
    }, [poll, isPending, error, address]);

    const fetchVoteEvents = useCallback(async () => {
        if (!publicClient) {
            return;
        }

        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock - 100000n; // Normally would query contract deployment height
        const abi = getAbiItem({
            abi: voting.CONTRACT_ABI,
            name: "VoteCasted",
        });

        if (!abi) {
            console.error("Failed to find VoteCasted abi");
            return;
        }

        const fetchedLogs = await publicClient.getLogs({
            address: voting.CONTRACT_ADDRESS as Address,
            event: abi,
            fromBlock: fromBlock,
            toBlock: currentBlock,
        });

        const events = [];

        for (const event of fetchedLogs) {
            const pollIndex = Number(event.args.pollIndex);

            if (pollIndex === voting.CONTRACT_POLL) {
                events.push({
                    timestamp: Number(event.blockTimestamp) * 1000,
                    optionIndex: Number(event.args.optionIndex),
                    address: event.address,
                });
            }
        }

        setEvents(events);
    }, [publicClient]);

    useEffect(() => {
        fetchVoteEvents();
    }, [fetchVoteEvents]);

    useWatchContractEvent({
        address: voting.CONTRACT_ADDRESS as Address,
        abi: voting.CONTRACT_ABI,
        eventName: "VoteCasted",
        args: {
            pollId: voting.CONTRACT_POLL,
        },
        onLogs(logs) {
            for (const log of logs) {
                const pollIndex = Number(log.args.pollIndex);
                const optionIndex = Number(log.args.optionIndex);

                if (pollIndex === voting.CONTRACT_POLL) {
                    const newVotes = { ...(votes ?? {}) };
                    newVotes[optionIndex] = (newVotes[optionIndex] ?? 0) + 1;
                    setVotes(newVotes);

                    const event = {
                        timestamp: Number(log.blockTimestamp) * 1000,
                        optionIndex: optionIndex,
                        address: log.address,
                    };
                    const newEvents = [...(events ?? [])];
                    newEvents.push(event);
                    setEvents(newEvents);

                    if (address?.toLowerCase() === log.args.voter.toLowerCase()) {
                        console.log("matches")
                        setHasVoted(true);
                        setVotedOption(optionIndex);
                    }
                }
            }
        },
        onError(error) {
            console.error("Error watching contract events:", error);
        },
    });

    const handleVote = (optionIndex: number) => {
        if (hasVoted) {
            alert("You have already voted!");
            return;
        }

        if (!address) {
            // TODO: open the login dialog
            return;
        }

        setCastingVote(true);
        castVote(voting.CONTRACT_POLL, optionIndex);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
            <nav className="bg-white/95 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="text-2xl font-bold text-purple-600">
                            DDD Brisbane
                        </div>
                        <ConnectWallet />
                    </div>
                </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {title !== null ? (
                    <h1
                        data-aos="fade-right"
                        className="text-4xl md:text-5xl font-bold text-white text-center mb-12 drop-shadow-lg"
                    >
                        {title}
                    </h1>
                ) : null}
                {options !== null ? (
                    <div
                        data-aos="fade-right"
                        data-aos-delay="200"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                    >
                        { options.map((option) => (
                            <VotingCard
                                key={option.optionIndex + 1}
                                option={option}
                                hasVoted={hasVoted || !votingOpen}
                                votedOption={votedOption}
                                onVote={handleVote}
                            />
                        ))}
                    </div>
                ) : null}
                {options !== null && votes !== null ? (
                    <VotingResults data-aos="fade-right" data-aos-delay="400" votes={votes} options={options} />
                ) : null}
                {options !== null && events !== null ? (
                    <VotingTimeline data-aos="fade-right" data-aos-delay="600" events={events} options={options} />
                ) : null}
            </div>
            <TransactionDialog
                open={castingVote}
                onClose={() => setCastingVote(false)}
                state={castVoteState?.state}
                txHash={castVoteState?.txHash}
                errorMessage={castVoteState?.error}
                title={"Submitting Transaction"}
                allowClose={castVoteState?.state === TransactionState.SUCCESS || castVoteState?.state === TransactionState.ERROR}
            />
        </div>
    );
}
