/**
 * Development server entry point
 * Runs Vite dev server with Express integration
 */

import "dotenv/config";
import { createServer as createViteServer } from "vite";
import { createServer as createExpressServer } from "./server/index";

async function startDevServer() {
  // Create Vite server
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });

  // Create Express app
  const app = createExpressServer();

  // Use Vite's middleware
  app.use(vite.middlewares);

  // Start server
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`✅ Dev server running at http://localhost:${PORT}`);
  });
}

startDevServer().catch((err) => {
  console.error("Failed to start dev server:", err);
  process.exit(1);
});
