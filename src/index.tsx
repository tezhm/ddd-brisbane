import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { type Chain, getDefaultConfig, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { PannaProvider } from "panna-sdk/react";
import "panna-sdk/styles.css";
import { Home } from "./components/pages/Home.tsx"
import "./index.css"

export const liskSepoliaChain = {
    id: 4202,
    name: "Lisk Sepolia",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://rpc.sepolia-api.lisk.com"],
            webSocket: ["wss://rpc.sepolia-ws.lisk.com"],
        },
        public: {
            http: ["https://rpc.sepolia-api.lisk.com"],
            webSocket: ["wss://rpc.sepolia-ws.lisk.com"],
        },
    },
    blockExplorers: {
        default: {
            name: 'Lisk Sepolia Blockscout',
            url: 'https://sepolia-blockscout.lisk.com',
        },
    },
    testnet: true,
} as const satisfies Chain;

export const liskConfig = getDefaultConfig({
    appName: "rgb",
    projectId: "16ffdea546df204f88f890e448595333",
    appUrl: "https://sepolia-blockscout.lisk.com",
    chains: [liskSepoliaChain],
});

export const walletTheme = lightTheme({
    accentColor: "rgb(16 185 129)",
    overlayBlur: 'small',
});

const queryClient: QueryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WagmiProvider config={liskConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={walletTheme}>
                    <PannaProvider clientId="b955e5ec244957bd248851c32e1647ad"
                                   partnerId="e99b37e4-3cff-4dfd-b5a2-73f68ed33978"
                                   chainId="4202">
                        <Home />
                    </PannaProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </StrictMode>
)
