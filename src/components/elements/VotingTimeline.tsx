import React, { useState, useEffect, useRef } from "react";
import { type Address } from "./types.ts";
import { type Option } from "./VotingCard.tsx";

type Bucket = Record<Option['optionIndex'], number>;
type Buckets = Record<number, Bucket>;

interface BucketDisplay {
    time: number;
    votes: Bucket;
    isCurrentMinute: boolean;
}

export interface VoteEvent {
    timestamp: number;
    optionIndex: number;
    address: Address;
}

export interface VotingTimelineProps {
    events?: VoteEvent[];
    startTime?: number;
    options?: Option[];
    "data-aos"?: string;
    "data-aos-delay"?: string;
}

const voteColors: Record<number, string> = {
    0: "#8b5cf6",
    1: "#ff5b94",
    2: "#ff9167",
    3: "#008aff",
    4: "#008d6e",
};

export const VotingTimeline: React.FC<VotingTimelineProps> = ({
    events = [],
    startTime = Date.now() - (60 * 10 * 1000), // Default to 10 minutes ago
    options = [],
    "data-aos": dataAos = "fade-right",
    "data-aos-delay": dataAosDelay = "900",
}: VotingTimelineProps) => {
    const [timelineData, setTimelineData] = useState<Buckets>({});
    const [currentTime, setCurrentTime] = useState<number>(Date.now());
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const buckets: Buckets = {};
        const nowMinuteKey = Math.floor(Date.now() / 60000) * 60000;
        const startMinuteKey = Math.floor(startTime / 60000) * 60000;

        events.forEach(event => {
            const eventTime = event.timestamp || Date.now();
            const minuteKey = Math.floor(eventTime / 60000) * 60000;

            if (minuteKey >= startMinuteKey && minuteKey <= nowMinuteKey) {
                if (!buckets[minuteKey]) {
                    const initialBucket: Bucket = {};
                    options.forEach(opt => initialBucket[opt.optionIndex] = 0);
                    buckets[minuteKey] = initialBucket;
                }

                const optionIndex = event.optionIndex;
                if (options.some(opt => opt.optionIndex === optionIndex)) {
                    buckets[minuteKey][optionIndex] = (buckets[minuteKey][optionIndex] || 0) + 1;
                }
            }
        });

        setTimelineData(buckets);
    }, [events, options]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timelineRef.current) {
            timelineRef.current.scrollLeft = timelineRef.current.scrollWidth;
        }
    }, [timelineData]);

    const generateTimelineBuckets = (): BucketDisplay[] => {
        const buckets: BucketDisplay[] = [];
        const nowMinuteKey = Math.floor(currentTime / 60000) * 60000;
        let currentMinute = Math.floor(startTime / 60000) * 60000;

        while (currentMinute <= nowMinuteKey) {
            const bucketData = timelineData[currentMinute] || {};

            const votes: Bucket = {};
            options.forEach(opt => {
                votes[opt.optionIndex] = bucketData[opt.optionIndex] || 0;
            });

            buckets.push({
                time: currentMinute,
                votes: votes,
                isCurrentMinute: nowMinuteKey === currentMinute
            });
            currentMinute += 60000;
        }

        return buckets;
    };

    const buckets = generateTimelineBuckets();

    const maxVotes = Math.max(
        ...buckets.map(bucket =>
            Object.values(bucket.votes).reduce((sum, count) => sum + count, 0)
        ),
        1
    );

    const formatTime = (timestamp: number): string => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    };

    const getOptionTitle = (optionIndex: number): string => {
        return options.find(opt => opt.optionIndex === optionIndex)?.title || `Option ${optionIndex}`;
    };

    return (
        <div data-aos={dataAos} data-aos-delay={dataAosDelay} className="bg-white/95 rounded-xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                Live Voting Timeline
            </h2>

            <div className="flex flex-wrap gap-6 mb-8">
                {options.map((option) => {
                    const color = voteColors[option.optionIndex] || "#6b7280";
                    return (
                        <div key={option.optionIndex} className="flex items-center gap-2">
                            <div
                                className="w-5 h-5 rounded-lg shadow-md"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-gray-700 text-sm font-medium">{option.title}</span>
                        </div>
                    );
                })}
            </div>

            <div
                ref={timelineRef}
                className="overflow-x-auto overflow-y-hidden pb-4 bg-gray-50 rounded-2xl p-6"
                style={{ scrollBehavior: "smooth" }}
            >
                <div className="flex items-end gap-3 min-w-max h-80">
                    {buckets.map((bucket) => {
                        const totalVotes = Object.values(bucket.votes).reduce((sum, count) => sum + count, 0);
                        const voteEntries = Object.entries(bucket.votes)
                            .map(([key, count]) => ({
                                optionIndex: Number(key),
                                count: count
                            }))
                            .filter(entry => entry.count > 0);

                        return (
                            <div
                                key={bucket.time}
                                className="flex flex-col items-center gap-2"
                                style={{ minWidth: "80px" }}
                            >
                                <div className="flex items-end justify-center gap-1 h-64 relative">
                                    {voteEntries.length === 0 ? (
                                        <div className="w-full h-2 bg-gray-200 rounded-full" />
                                    ) : (
                                        voteEntries.map((entry) => {
                                            const { optionIndex, count } = entry;
                                            const heightPercent = (count / maxVotes) * 100;
                                            const color = voteColors[optionIndex] || "#6b7280";
                                            const title = getOptionTitle(optionIndex);

                                            return (
                                                <div
                                                    key={optionIndex}
                                                    className="relative group transition-all duration-300 hover:opacity-80"
                                                    style={{
                                                        width: `${80 / voteEntries.length}px`,
                                                        height: `${Math.max(heightPercent, 4)}%`,
                                                        backgroundColor: color,
                                                        borderRadius: "4px 4px 0 0",
                                                        boxShadow: bucket.isCurrentMinute
                                                            ? `0 0 20px ${color}80`
                                                            : "none",
                                                        animation: bucket.isCurrentMinute
                                                            ? "pulse 2s ease-in-out infinite"
                                                            : "none"
                                                    }}
                                                >
                                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                        <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl text-xs">
                                                            <div className="font-semibold">{title}</div>
                                                            <div>{count} {count === 1 ? "vote" : "votes"}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}

                                    {bucket.isCurrentMinute && (
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full">
                                            <div className="h-1 bg-purple-600 rounded-full animate-pulse shadow-lg" />
                                        </div>
                                    )}
                                </div>

                                <div className={`text-xs font-medium ${bucket.isCurrentMinute ? "text-purple-600 font-bold" : "text-gray-500"}`}>
                                    {formatTime(bucket.time)}
                                </div>

                                {totalVotes > 0 && (
                                    <div className="text-xs font-bold text-purple-600 bg-purple-100 px-2.5 py-1 rounded-full">
                                        {totalVotes}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
};
