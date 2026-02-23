import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api/stock": {
        target: "http://52.89.16.139:5678",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stock/, "/webhook/stockanalyize")
      }
    }
  }
});


