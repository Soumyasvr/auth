import express from "express";
import cors from "cors"
import "dotenv/config"
import cookieparser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import { authRoutes } from "./routes/authRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";

const app = express()
const port = process.env.PORT || 4000

connectDB()

const allowedOrigins = [process.env.FRONTEND_URL]

app.use(express.json())
app.use(cors({origin: allowedOrigins, credentials: true}))
app.use(cookieparser())

//API endpoints
app.get("/", (req, res) => {
    res.send("API is running...")
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})