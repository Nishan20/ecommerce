import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { config } from "dotenv";
import { createTables } from "./utils/createTables.js";

const app = express();

config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
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

// Import routes
import authRoutes from "./router/authroutes.js";
import productRoutes from "./router/productRoutes.js";
import orderRoutes from "./router/orderRoutes.js";

// Route Middlewares
app.use("/api/v1", authRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);

// Create tables
console.log("Calling createTables...");
createTables();

// Error Middleware (should be after all routes)
import errorMiddleware from "./middlewares/errorMiddleware.js";
app.use(errorMiddleware);

export default app;
