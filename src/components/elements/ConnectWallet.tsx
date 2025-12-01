import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { ConnectButton } from "panna-sdk/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useWallet } from "../hooks/Wallet.tsx";

export type ConnectWalletHandle = {
    openModal: () => void;
    closeModal: () => void;
};

export const ConnectWallet = forwardRef<ConnectWalletHandle>((_, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const container = useRef<HTMLDivElement>(null);
    const [connectButton, setConnectButton] = useState<HTMLButtonElement|null>(null);
    const { openConnectModal } = useConnectModal();
    const { address, logout } = useWallet();

    useImperativeHandle(ref, () => ({
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
    }));

    const handleEmailClick = () => {
        setIsModalOpen(false);
        connectButton?.click();
    };

    const handleWalletClick = () => {
        setIsModalOpen(false);

        if (openConnectModal) {
            openConnectModal();
        }
    };

    useLayoutEffect(() => {
        const el = container.current;
        if (!el) {
            return;
        }

        const btn = el.querySelector("button");
        if (!btn) {
            return;
        }

        setConnectButton(btn);
    }, [container, setConnectButton]);

    return (
        <>
            {address ?
                <button
                    onClick={() => logout()}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    Sign Out
                </button> :
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    Sign In
                </button>
            }

            <div ref={container} style={{ display: "none" }}>
                <ConnectButton connectButton={{ title: "" }} connectDialog={{ title: "Email sign in" }} />
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Sign In
                            </h2>
                            <p className="text-gray-600">
                                Choose your preferred sign-in method
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleEmailClick}
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                Continue with Email
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">or</span>
                                </div>
                            </div>

                            <button
                                onClick={handleWalletClick}
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                </svg>
                                Continue with Wallet
                            </button>
                        </div>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            By signing in, you agree to our Terms of Service
                        </p>
                    </div>
                </div>
            )}
        </>
    );
});
