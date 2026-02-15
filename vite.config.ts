import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config: any = {
    server: {
      host: "::",
      port: 8080,
      fs: {
        allow: ["./client", "./shared"],
        deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
      },
    },
    build: {
      outDir: "dist/spa",
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
  };

  // Only add Express plugin during development
  if (command === "serve") {
    config.plugins.push({
      name: "express-plugin",
      apply: "serve",
      async configureServer(server: any) {
        // Lazy load createServer only during serve, not build
        const { createServer } = await import("./server/index.ts");
        const app = createServer();
        server.middlewares.use(app);
      },
    });
  }

  return config;
});
