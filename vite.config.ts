import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        configure(proxy) {
          proxy.on("proxyReq", (proxyReq, req) => {
            // Retain the public host through the Codespaces -> Vite -> API proxy.
            // The API uses this value to reject cross-origin login/logout requests.
            const browserHost = req.headers["x-forwarded-host"] || req.headers.host;
            if (browserHost && typeof browserHost === "string") {
              proxyReq.setHeader("x-forwarded-host", browserHost);
            }
          });
        },
      },
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
