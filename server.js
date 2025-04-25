import express from "express";
import next from "next";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

// Load environment variables
dotenv.config();

const require = createRequire(import.meta.url);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

// Fix __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app
  .prepare()
  .then(() => {
    const server = express();
    
    // Middleware
    const corsOptions = {
      origin: "*", // Allow requests from all origins
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      optionsSuccessStatus: 200,
    };
    
    // Use CORS middleware with options
    server.use(cors(corsOptions));
    server.use(express.json());
    
    // Import routes using require for compatibility
    const authRoutes = require(path.join(
      __dirname,
      "src",
      "backend",
      "routes",
      "authRoutes"
    ));
    
    server.use("/api/auth", authRoutes);
    
    // Next.js handler for all other routes
    server.all("*", (req, res) => handle(req, res));
    
    server.listen(PORT, () => {
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
