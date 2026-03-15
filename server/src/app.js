import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "dotenv";

config({ path: "./src/config/config.env" });

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    tempFileDir: "./uploads",
    useTempFiles: true,
  })
);

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { isAuthenticated } from "./middlewares/authMiddleware.js";
import { getUser } from "./controllers/authController.js";

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);

// API Root
app.get("/api", (req, res) => res.send("API running"));

// User profile helper route (alias)
app.get("/api/user", isAuthenticated, getUser);


// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Proxy frontend in development (so http://localhost:4000 serves the React app)
const isDev = process.env.NODE_ENV !== "production";
if (isDev) {
  const viteProxy = createProxyMiddleware({
    target: "http://localhost:5173",
    changeOrigin: true,
    ws: true,
    logLevel: "silent",
  });

  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
    return viteProxy(req, res, next);
  });
} else {
  // In production, serve static build from the client
  app.use(express.static("../client/dist"));
  app.get("*", (req, res) => {
    res.sendFile("index.html", { root: "../client/dist" });
  });
}

// Error middleware
import errorMiddleware from "./middlewares/errorMiddleware.js";
app.use(errorMiddleware);

export default app;