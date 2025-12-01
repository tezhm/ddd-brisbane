import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { PannaProvider } from "panna-sdk/react";
import "panna-sdk/styles.css";
import { liskSepoliaConfig } from "./config/lisk.ts"
import { Home } from "./components/pages/Home.tsx"
import "./index.css"

export const walletTheme = lightTheme({
    accentColor: "rgb(16 185 129)",
    overlayBlur: 'small',
});

const queryClient: QueryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WagmiProvider config={liskSepoliaConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={walletTheme}>
                    <PannaProvider clientId="b955e5ec244957bd248851c32e1647ad"
                                   partnerId="e99b37e4-3cff-4dfd-b5a2-73f68ed33978"
                                   chainId={`${liskSepoliaConfig.chains[0].id}`}>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/ddd-brisbane" element={<Home />} />
                            </Routes>
                        </BrowserRouter>
                    </PannaProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </StrictMode>
)
