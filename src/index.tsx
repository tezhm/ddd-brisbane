import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { PannaProvider } from "panna-sdk/react";
import "panna-sdk/styles.css";
import App from "./App.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PannaProvider clientId="b955e5ec244957bd248851c32e1647ad"
                       partnerId="e99b37e4-3cff-4dfd-b5a2-73f68ed33978"
                       chainId="4202">
            <App />
        </PannaProvider>
    </StrictMode>,
)
