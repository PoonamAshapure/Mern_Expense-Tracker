import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRouter from "./routes/expenseRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();

const allowedOrigins = process.env.CLIENT_URL.split(",");
// Middleware to handle CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow REST clients or same origin requests
      if (!allowedOrigins.includes(origin)) {
        return callback(
          new Error("CORS policy: This origin is not allowed"),
          false
        );
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/dashboard", dashboardRoutes);

// Serve uploads folder
// Fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder setup
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running pn port ${PORT}`));
