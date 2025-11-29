import { type Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";

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

export const liskSepoliaConfig = getDefaultConfig({
    appName: "rgb",
    projectId: "16ffdea546df204f88f890e448595333",
    appUrl: "https://sepolia-blockscout.lisk.com",
    chains: [liskSepoliaChain],
});
