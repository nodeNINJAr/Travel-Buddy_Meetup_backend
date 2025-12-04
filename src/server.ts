import http, { Server } from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";
import readline from "readline";

dotenv.config();

let server: Server | null = null;

// 
if (process.platform === "win32") {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("SIGINT", () => {
    process.emit("SIGINT");
  });
}

  //  Connect to Prisma Database  */
async function connectToDb() {
  try {
    await prisma.$connect();
    console.log("🟢 Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

  //  Start HTTP Server
async function startServer() {
  try {
    await connectToDb();

    const PORT = process.env.PORT || 5000;

    server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });

    registerProcessEvents();
  } catch (error) {
    console.error("❌ Startup error:", error);
    process.exit(1);
  }
}


  //  Graceful Shutdown Logic

async function gracefulShutdown(reason: string) {
  console.warn(`⚠️  Received ${reason}, performing graceful shutdown...`);

  try {
    // Close server first
    if (server) {
      await new Promise<void>((resolve) => server!.close(() => resolve()));
      console.log("🔻 HTTP server closed");
    }

    // Disconnect Prisma
    await prisma.$disconnect();
    console.log("🔻 Database disconnected");

    console.log("🟢 Shutdown complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
}


  //  Register system signal handlers
function registerProcessEvents() {
  ["SIGTERM", "SIGINT"].forEach((signal) => {
    process.on(signal, () => gracefulShutdown(signal));
  });

  process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err);
    gracefulShutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled Promise Rejection:", reason);
    gracefulShutdown("unhandledRejection");
  });
}


// 🚀 Boot Application
startServer();
