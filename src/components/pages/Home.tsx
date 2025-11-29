import { useState } from "react"
import { ConnectButton } from "panna-sdk/react";
import inflatableLottie from './assets/inflatable-tube-man.json';
import llamaLottie from './assets/llama.json';
import triangleLottie from './assets/triangle-man.json';
import { ExpandingButton } from "./components/elements/ExpandingButton.tsx";
import { type Option, VotingCard } from "./components/elements/VotingCard.tsx";

export function App() {
    const [votes, setVotes] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0 });
    const [hasVoted, setHasVoted] = useState<boolean>(false);
    const [votedOption, setVotedOption] = useState<number | null>(null);

    const options: Option[] = [
        {
            id: 1,
            title: "Cool Llama",
            description: "Vote for the llama whose dance moves are 100% vibe, 0% coordination, and powered entirely by untamed confidence and sunglasses.",
            image: null,
            lottieUrl: llamaLottie,
        },
        {
            id: 2,
            title: "Inflatable Tube",
            description: "Vote for the only dancer fueled by a leaf blower, choreographed by chaos itself, and personally responsible for several nervous breakdowns in the physics department.",
            image: null,
            lottieUrl: inflatableLottie,
        },
        {
            id: 3,
            title: "Triangle Man",
            description: "Vote for the three-sided sensation proving that triangles aren’t just the strongest shape in engineering, they're also the most structurally sound on the dance floor.",
            image: null,
            lottieUrl: triangleLottie,
        }
    ];

    const handleVote = (optionId: number) => {
        if (hasVoted) {
            alert('You have already voted!');
            return;
        }

        setVotes(prev => ({
            ...prev,
            [optionId]: prev[optionId] + 1
        }));
        setHasVoted(true);
        setVotedOption(optionId);
    };

    const getTotalVotes = (): number => {
        return Object.values(votes).reduce((a, b) => a + b, 0);
    };

    const getPercentage = (optionId: number): string | number => {
        const total = getTotalVotes();
        return total > 0 ? ((votes[optionId] / total) * 100).toFixed(1) : 0;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
            <nav className="bg-white/95 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="text-2xl font-bold text-purple-600">
                            DDD Brisbane
                        </div>
                        <ExpandingButton leftButton={
                            <ConnectButton connectButton={{title: "Connect"}}
                                           connectDialog={{
                                               title: "Connect Wallet",
                                               description: "description",
                                               otpTitle: "otpTitle",
                                               otpDescription: "otpDescription",
                                           }}
                                // className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 ease-in-out animate-[slideIn_0.3s_ease-out]"
                            />
                        }
                                         rightButton={
                                             <button
                                                 onClick={() => {}}
                                                 className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 ease-in-out animate-[slideIn_0.3s_ease-out]"
                                             >
                                                 {"asdasd"}
                                             </button>
                                         }></ExpandingButton>
                        {/*<button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">*/}
                        {/*  Sign In*/}
                        {/*</button>*/}
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 drop-shadow-lg">
                    Vote For Your Favorite
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {options.map((option) => (
                        <VotingCard
                            key={option.id}
                            option={option}
                            hasVoted={hasVoted}
                            votedOption={votedOption}
                            onVote={handleVote}
                        />
                    ))}
                </div>

                {/* Voting Results */}
                <div className="bg-white/95 rounded-xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                        Current Results
                    </h2>
                    <div className="space-y-6">
                        {options.map((option) => (
                            <div key={option.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="font-semibold text-gray-700 min-w-[120px]">
                  {option.title}
                </span>
                                <div className="flex-1 h-8 bg-gray-200 rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500 ease-out flex items-center justify-end pr-3"
                                        style={{ width: `${getPercentage(option.id)}%` }}
                                    >
                                        {votes[option.id] > 0 && (
                                            <span className="text-white font-semibold text-sm">
                        {votes[option.id]}
                      </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-gray-600 font-medium min-w-[60px] text-right">
                  {getPercentage(option.id)}%
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
