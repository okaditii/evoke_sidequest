import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  // Locally, /api goes to server.js (node server.js); in production it's the serverless function in api/.
  server: { port: 5173, proxy: { "/api": "http://localhost:5000" } },
  preview: { proxy: { "/api": "http://localhost:5000" } },
});
