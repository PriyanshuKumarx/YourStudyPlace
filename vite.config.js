import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@fortawesome/react-fontawesome", "@fortawesome/free-solid-svg-icons"],
  },
});