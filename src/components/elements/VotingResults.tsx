import React from "react";
import type { Option } from "./VotingCard.tsx";

interface VotingResultsProps {
    votes?: Record<number, number>;
    options?: Option[];
    "data-aos"?: string;
    "data-aos-delay"?: string;
}

export const VotingResults: React.FC<VotingResultsProps> = ({
    votes = {},
    options = [],
    "data-aos": dataAos = "fade-right",
    "data-aos-delay": dataAosDelay = "600",
}: VotingResultsProps) => {
    const getTotalVotes = (): number => {
        return Object.values(votes).reduce((a, b) => a + b, 0);
    };

    const getPercentage = (optionId: number): string | number => {
        const total = getTotalVotes();
        return total > 0 ? (((votes[optionId] ?? 0) / total) * 100).toFixed(1) : 0;
    };

    return (
        <div data-aos={dataAos} data-aos-delay={dataAosDelay} className="bg-white/95 rounded-xl shadow-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                Current Results
            </h2>
            <div className="space-y-6">
                {options.map((option) => (
                    <div key={option.optionIndex + 1} className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <span className="font-semibold text-gray-700 min-w-[120px]">
                            {option.title}
                        </span>
                        <div className="flex-1 h-8 bg-gray-200 rounded-full overflow-hidden relative">
                            <div
                                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500 ease-out flex items-center justify-end pr-3"
                                style={{ width: `${getPercentage(option.optionIndex)}%` }}
                            >
                                {votes[option.optionIndex] > 0 && (
                                    <span className="text-white font-semibold text-sm">
                                        {votes[option.optionIndex]}
                                    </span>
                                )}
                            </div>
                        </div>
                        <span className="text-gray-600 font-medium min-w-[60px] text-right">
                            {getPercentage(option.optionIndex)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
