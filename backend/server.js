import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { supabase } from "./src/config/supabase.js";
import productsRouter from "./src/routes/products.js";
import categoriesRouter from "./src/routes/categories.js";
import ordersRouter from "./src/routes/orders.js";
import couponsRouter from "./src/routes/coupons.js";
import authRouter from "./src/routes/auth.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all frontend clients
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "apikey"]
}));

// Request Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/auth", authRouter);

// Health Check & Supabase Connection Test
app.get("/api/health", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .limit(1);

    if (error) {
      return res.status(500).json({
        status: "DEGRADED",
        message: "Database connection failed",
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    return res.json({
      status: "HEALTHY",
      message: "Express backend connected to Supabase PostgreSQL successfully!",
      dbSample: data,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Static Hosting of Frontend (Enables single-server hosting)
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// API 404 Fallback
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.originalUrl} not found` });
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`
  ==============================================================
  🌿 Meenachi Grocery Express API Server
  🚀 Server Running:   http://localhost:${PORT}
  📡 API Healthcheck:  http://localhost:${PORT}/api/health
  🛍️ Products API:     http://localhost:${PORT}/api/products
  📦 Frontend App:     http://localhost:${PORT}/index.html
  🔗 Supabase Project: ${process.env.SUPABASE_URL || 'https://jyosypwmwrdvcolcswio.supabase.co'}
  ==============================================================
  `);
});

export default app;
