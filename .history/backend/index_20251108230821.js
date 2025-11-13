import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import reviewRoute from "./routes/review.route.js";
import notificationRoute from "./routes/notification.route.js";
import paymentRoute from "./routes/payment.route.js";
import wageRoute from "./routes/wage.route.js";
import chatbotRoute from "./routes/chatbot.route.js";

// Load environment variables
dotenv.config({});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true,
};
app.use(cors(corsOptions));

// Database connection
connectDB();

// Default route (just to test)
app.get("/", (req, res) => {
  res.send("🚀 Server is running and MongoDB is connected successfully!");
});

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/wage", wageRoute);
app.use("/api/v1/chatbot", chatbotRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
