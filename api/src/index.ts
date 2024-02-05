import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import errorMiddleware from "./middlewares/error.middleware";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.use(errorMiddleware);
