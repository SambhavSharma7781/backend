import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(express.static("public"));
app.use(cookieParser());

// routes 
import userRoutes from "./routes/user.routes.js";
import healthRoutes from "./routes/health.routes.js";
import videoRoutes from "./routes/video.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import likeRoutes from "./routes/like.routes.js";

//routes declaration 
app.use("/api/v1/users", userRoutes);
app.use("/api/v1", healthRoutes);
app.use("/api/v1", videoRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/likes", likeRoutes);

export default app;