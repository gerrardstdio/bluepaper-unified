import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import rsvpApiPlugin from "./server/rsvpApiPlugin";
import adminApiPlugin from "./server/adminApiPlugin";

export default defineConfig({
  plugins: [react(), tailwindcss(), rsvpApiPlugin(), adminApiPlugin()],
  server: {
    port: 5173,
    watch: {
      ignored: ["**/data/customers/**", "**/data/**/*.json"],
    },
  },
});
