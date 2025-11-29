import React from "react";
import { Check, CircleAlert, CircleCheckBig, ExternalLink, LoaderCircle, X } from "lucide-react";
import { TransactionState } from "./types.ts";

interface TransactionDialogProps {
    open: boolean;
    onClose: () => void;
    state?: TransactionState;
    txHash?: string|null;
    errorMessage?: string|null;
    title?: string;
    allowClose?: boolean;
}

interface StateContent {
    icon: React.ReactNode;
    title: string;
    description: string;
    txHash?: string|null;
    explorerUrl?: string|null;
}

const steps = ["Sign Transaction", "Submit to Network", "Confirm"];

const getActiveStep = (state: TransactionState): number => {
    switch (state) {
        case TransactionState.WAITING_SIGNATURE:
            return 0;
        case TransactionState.PENDING:
            return 1;
        case TransactionState.CONFIRMING:
            return 2;
        case TransactionState.SUCCESS:
            return 3;
        case TransactionState.ERROR:
            return -1;
        default:
            return 0;
    }
};

const getExplorerUrl = (txHash?: string|null): string|null => {
    if (!txHash) {
        return null;
    }

    return `https://sepolia-blockscout.lisk.com/tx/${txHash}`;
};

const getStateContent = (
    state: TransactionState,
    errorMessage?: string|null,
    txHash?: string|null,
): StateContent => {
    const explorerUrl = getExplorerUrl(txHash);
    const iconSize = 80;

    switch (state) {
        case TransactionState.WAITING_SIGNATURE:
            return {
                icon: <LoaderCircle size={iconSize} className="text-indigo-500 animate-spin"/>,
                title: "Waiting for Signature",
                description: "Please confirm the transaction in your wallet",
            };
        case TransactionState.PENDING:
            return {
                icon: <LoaderCircle size={iconSize} className="text-indigo-500 animate-spin"/>,
                title: "Submitting Transaction",
                description: "Your transaction is being submitted to the network",
                txHash,
                explorerUrl,
            };
        case TransactionState.CONFIRMING:
            return {
                icon: <LoaderCircle size={iconSize} className="text-indigo-500 animate-spin"/>,
                title: "Confirming Transaction",
                description: "Waiting for blockchain confirmation...",
                txHash,
                explorerUrl,
            };
        case TransactionState.SUCCESS:
            return {
                icon: <CircleCheckBig className="text-indigo-500" size={iconSize}/>,
                title: "Transaction Successful",
                description: "Your transaction has been confirmed",
                txHash,
                explorerUrl,
            };
        case TransactionState.ERROR:
            return {
                icon: <CircleAlert className="text-red-500" size={iconSize}/>,
                title: "Transaction Failed",
                description: errorMessage || "Something went wrong",
                txHash,
                explorerUrl,
            };
        default:
            return {
                icon: <LoaderCircle size={iconSize} className="text-indigo-500 animate-spin"/>,
                title: "Processing",
                description: "Please wait...",
            };
    }
};

export const TransactionDialog: React.FC<TransactionDialogProps> = ({
    open,
    onClose,
    state = (TransactionState as any).IDLE, // Cast as any if IDLE is not strictly defined in TransactionState, or ensure it's defined.
    txHash = null,
    errorMessage = null,
    title = "Transaction in Progress",
    allowClose = true,
}: TransactionDialogProps) => {
    if (!open) {
        return null;
    }

    const activeStep = getActiveStep(state);
    const content = getStateContent(state, errorMessage, txHash);
    const isFinished = state === (TransactionState as any).SUCCESS || state === (TransactionState as any).ERROR;
    const canClose = allowClose && isFinished;

    const Stepper = () => (
        <div className="flex justify-between w-full max-w-xl mb-6">
            {steps.map((label, index) => {
                const isCurrent = index === activeStep;
                const isCompleted = index < activeStep;

                let iconClasses = "w-8 h-8 flex items-center justify-center rounded-full text-white font-bold transition-all duration-300";
                let labelClasses = "text-sm mt-2 text-center transition-colors duration-300";

                if (isCompleted) {
                    iconClasses += " bg-indigo-500";
                    labelClasses += " text-white";
                } else if (isCurrent) {
                    iconClasses += " bg-indigo-500 ring-4 ring-indigo-500/50";
                    labelClasses += " text-white font-semibold";
                } else {
                    iconClasses += " bg-gray-500 text-gray-300";
                    labelClasses += " text-gray-400";
                }

                const connector = index < steps.length - 1 && (
                    <div
                        className={`absolute top-1/2 left-[calc(50%+24px)] transform -translate-y-1/2 top-[16px] h-0.5 w-[calc(100%-48px)] transition-colors duration-300 -z-10 ${
                            isCompleted ? 'bg-indigo-500' : 'bg-gray-500'
                        }`}
                    ></div>
                );

                return (
                    <div key={label} className="flex-1 relative flex flex-col items-center">
                        <div className="relative z-10">
                            <div className={iconClasses}>
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    index + 1
                                )}
                            </div>
                        </div>
                        <div className={labelClasses}>{label}</div>
                        {connector}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div
            className="fixed inset-0 z-[100001] flex items-center justify-center p-4"
            style={{
                background: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(5px)",
            }}
            onClick={canClose ? onClose : undefined}
        >
            <div
                className="flex flex-col items-center justify-center h-full w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {canClose && (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-white p-2 rounded-full hover:bg-white/10 transition-colors z-20"
                    >
                        <X />
                    </button>
                )}

                <h2 className="text-3xl text-white mb-8 font-semibold text-center">
                    {title}
                </h2>

                {state !== (TransactionState as any).ERROR && (
                    <Stepper />
                )}

                <div
                    className="flex flex-col items-center gap-3 p-8 rounded-xl backdrop-blur-md bg-white/5 min-w-72 max-w-md w-full"
                >
                    <div className="mb-4">{content.icon}</div>

                    <h3 className="text-2xl text-white font-semibold text-center">
                        {content.title}
                    </h3>

                    <p className="text-base text-white/70 text-center max-w-xs">
                        {content.description}
                    </p>

                    {content.txHash && (
                        <div className="mt-4 p-3 rounded-lg bg-white/10 w-full">
                            <p className="text-xs text-white/50 uppercase">
                                Transaction Hash
                            </p>
                            <p className="text-sm text-white font-mono break-all mt-0.5">
                                {content.txHash}
                            </p>
                        </div>
                    )}

                    {content.explorerUrl && (
                        <a
                            href={content.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-indigo-300 text-sm hover:underline transition-colors"
                        >
                            View on Explorer
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}

                    {isFinished && allowClose && (
                        <button
                            onClick={onClose}
                            className="mt-4 px-6 py-3 rounded-xl bg-indigo-500 text-white text-base font-medium hover:bg-indigo-600 transition-colors uppercase tracking-wider"
                        >
                            {state === (TransactionState as any).SUCCESS ? "Done" : "Close"}
                        </button>
                    )}
                </div>

                {!isFinished && (
                    <p className="text-sm text-white/50 mt-6 text-center">
                        Please do not close this window
                    </p>
                )}
            </div>
        </div>
    );
};
