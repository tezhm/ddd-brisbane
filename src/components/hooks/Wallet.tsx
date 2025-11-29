import { useEffect, useState } from "react";
import { useActiveWallet, useLogout } from "panna-sdk/react";
import { useAccount, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { voting } from "../../config/voting.ts";
import { TransactionState } from "../elements/types.ts";

type Address = `0x${string}`;

export interface Transaction {
    state: TransactionState;
    txHash?: string;
    error?: string;
}

export interface Wallet {
    address: string|null;
    castVote: (pollIndex: number, optionIndex: number) => void;
    castVoteState: Transaction|null;
    logout: () => void;
}

export function useWallet(): Wallet {
    const pannaWallet = useActiveWallet();
    const { disconnect: pannaDisconnect } = useLogout();
    const { data: txHash, isPending, writeContract, error: writeError } = useWriteContract();
    const { isSuccess: isConfirmed, isError: isReceiptError, error: receiptError } = useWaitForTransactionReceipt({ hash: txHash });
    const { isConnected, address } = useAccount();
    const { disconnect: wagmiDisconnect } = useDisconnect();
    const [castVoteState, setCastVoteState] = useState<Transaction|null>(null);

    const castVote = (pollIndex: number, optionIndex: number) => {
        if (!!pannaWallet) {
            return;
        }

        if (!isPending) {
            setCastVoteState({ state: TransactionState.WAITING_SIGNATURE });
            writeContract({
                address: voting.CONTRACT_ADDRESS as Address,
                abi: voting.CONTRACT_ABI,
                functionName: "castVote",
                args: [pollIndex, optionIndex],
            });
        }
    };

    const logout = () => {
        if (!!pannaWallet) {
            pannaDisconnect(pannaWallet);
        }

        if (isConnected) {
            wagmiDisconnect();
        }
    };

    useEffect(() => {
        if (!txHash) {
            return;
        }

        setCastVoteState({ state: TransactionState.CONFIRMING, txHash });
    }, [txHash]);

    useEffect(() => {
        if (isConfirmed) {
            setCastVoteState((currentState) => ({
                state: TransactionState.SUCCESS,
                txHash: currentState?.txHash,
            }));
        }
    }, [isConfirmed]);

    useEffect(() => {
        if (writeError) {
            setCastVoteState({
                state: TransactionState.ERROR,
                error: writeError.message.includes("User rejected") ? "Transaction rejected" : "Transaction failed",
            });
            console.error(writeError);
        }
    }, [writeError]);

    useEffect(() => {
        if (isReceiptError) {
            setCastVoteState((currentState) => ({
                state: TransactionState.ERROR,
                txHash: currentState?.txHash,
                error: receiptError?.message ?? "Transaction failed",
            }));
            console.error(receiptError);
        }
    }, [isReceiptError, receiptError]);

    return {
        address: pannaWallet?.getAccount()?.address ?? address ?? null,
        castVote,
        logout,
        castVoteState,
    };
}
