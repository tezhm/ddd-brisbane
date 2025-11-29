import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

export interface Option {
    optionId: number;
    title: string;
    description: string;
    lottieUrl: any;
}

export interface VotingCardProps {
    option: Option;
    hasVoted: boolean;
    votedOption: number|null;
    onVote: (optionId: number) => void;
}

export const VotingCard: React.FC<VotingCardProps> = ({ option, hasVoted, votedOption, onVote }: VotingCardProps) => {
    const lottieContainer = useRef<HTMLDivElement>(null);
    const animationInstance = useRef<any>(null);

    useEffect(() => {
        if (lottieContainer.current && option.lottieUrl) {
            animationInstance.current = lottie.loadAnimation({
                container: lottieContainer.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData : option.lottieUrl
            });

            return () => {
                if (animationInstance.current) {
                    animationInstance.current.destroy();
                }
            };
        }
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="w-full h-64 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center overflow-hidden">
                <div ref={lottieContainer} className="w-full h-full" />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {option.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                    {option.description}
                </p>
                <button
                    onClick={() => onVote(option.optionId)}
                    disabled={hasVoted}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        votedOption === option.optionId
                            ? "bg-purple-600 text-white cursor-default"
                            : hasVoted
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                                : "bg-green-500 hover:bg-green-600 text-white hover:scale-105 active:scale-95"
                    }`}
                >
                    {votedOption === option.optionId ? "✓ Voted" : `Vote for ${option.title}`}
                </button>
            </div>
        </div>
    );
}
