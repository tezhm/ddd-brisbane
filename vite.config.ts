import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    base: "/ddd-brisbane",
    server: {
        port: 3000,
        allowedHosts: ["local.rgblisk.io", "rgblisk.io"],
    },
})
