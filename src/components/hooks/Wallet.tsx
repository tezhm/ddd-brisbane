import { useEffect, useState } from "react";
import { transaction, chain } from "panna-sdk/core";
import { useActiveWallet, useLogout, usePanna, useActiveAccount } from "panna-sdk/react";
import { useAccount, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { voting } from "../../config/voting.ts";
import { type Address, TransactionState } from "../elements/types.ts";

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
    const [address, setAddress] = useState<string|null>(null);
    const [castVoteState, setCastVoteState] = useState<Transaction|null>(null);
    const [txHash, setTxHash] = useState<Address|undefined>(undefined);
    // Panna hooks
    const pannaWallet = useActiveWallet();
    const { client: pannaClient } = usePanna();
    const pannaAccount = useActiveAccount();
    const { disconnect: pannaDisconnect } = useLogout();
    // Wagmi hooks
    const { data: wagmiWriteTx, isPending: wagmiWriteIsPending, writeContract: wagmiWriteContract, error: wagmiWriteError } = useWriteContract();
    const { isSuccess: wagmiTxSuccess, isError: wagmiTxIsError, error: wagmiTxError } = useWaitForTransactionReceipt({ hash: txHash });
    const { isConnected: wagmiIsConnected, address: wagmiAddress } = useAccount();
    const { disconnect: wagmiDisconnect } = useDisconnect();

    const castVote = async (pollIndex: number, optionIndex: number) => {
        if (!!pannaWallet) {
            const account = pannaWallet.getAccount();

            if (!account) {
                return;
            }

            try {
                setCastVoteState({ state: TransactionState.WAITING_SIGNATURE });
                const tx = transaction.prepareContractCall({
                    client: pannaClient,
                    chain: chain.liskSepolia,
                    address: voting.CONTRACT_ADDRESS as Address,
                    method: "function castVote(uint pollIndex, uint optionIndex)",
                    params: [pollIndex, optionIndex],
                });
                const result = await transaction.sendTransaction({ account, transaction: tx });
                setTxHash(result.transactionHash);
            } catch (error) {
                setCastVoteState({ state: TransactionState.ERROR, error: "Transaction failed" });
                console.log(error);
            }
        }

        if (wagmiIsConnected && !wagmiWriteIsPending) {
            setCastVoteState({ state: TransactionState.WAITING_SIGNATURE });
            wagmiWriteContract({
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

        if (wagmiIsConnected) {
            wagmiDisconnect();
        }
    };

    useEffect(() => {
        if (!wagmiWriteTx) {
            return;
        }

        setTxHash(wagmiWriteTx);
    }, [wagmiWriteTx]);

    useEffect(() => {
        if (!txHash) {
            return;
        }

        setCastVoteState({ state: TransactionState.CONFIRMING, txHash });
    }, [txHash]);

    useEffect(() => {
        if (wagmiTxSuccess) {
            setCastVoteState((currentState) => ({
                state: TransactionState.SUCCESS,
                txHash: currentState?.txHash,
            }));
        }
    }, [wagmiTxSuccess]);

    useEffect(() => {
        if (wagmiWriteError) {
            setCastVoteState({
                state: TransactionState.ERROR,
                error: wagmiWriteError.message.includes("User rejected") ? "Transaction rejected" : "Transaction failed",
            });
            console.error(wagmiWriteError);
        }
    }, [wagmiWriteError]);

    useEffect(() => {
        if (wagmiTxIsError) {
            setCastVoteState((currentState) => ({
                state: TransactionState.ERROR,
                txHash: currentState?.txHash,
                error: wagmiTxError?.message ?? "Transaction failed",
            }));
            console.error(wagmiTxError);
        }
    }, [wagmiTxIsError, wagmiTxError]);

    useEffect(() => {
        setAddress(pannaAccount?.address ?? wagmiAddress ?? null);
    }, [pannaAccount, wagmiAddress]);

    return {
        address,
        castVote,
        logout,
        castVoteState,
    };
}
