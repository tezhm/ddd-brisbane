import { useActiveWallet, useLogout } from "panna-sdk/react";
import { useAccount, useDisconnect } from "wagmi";

export interface Wallet {
    address: string|null;
    sendTransaction: () => void;
    logout: () => void;
}

export function useWallet(): Wallet {
    const pannaWallet = useActiveWallet();
    const { disconnect: pannaDisconnect } = useLogout();
    const { isConnected, address } = useAccount();
    const { disconnect: wagmiDisconnect } = useDisconnect();

    const sendTransaction = () => {

    };

    const logout = () => {
        if (!!pannaWallet) {
            pannaDisconnect(pannaWallet);
        }

        if (isConnected) {
            wagmiDisconnect();
        }
    };

    return {
        address: pannaWallet?.getAccount()?.address ?? address ?? null,
        sendTransaction,
        logout,
    };
}
