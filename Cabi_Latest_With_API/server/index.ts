import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getUberPriceEstimates, getUberTimeEstimates, bookUberRide } from "./routes/uber";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Uber API proxy routes
  app.get("/api/uber/price-estimates", getUberPriceEstimates);
  app.get("/api/uber/time-estimates", getUberTimeEstimates);
  app.post("/api/uber/book-ride", bookUberRide);

  return app;
}
