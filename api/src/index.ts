import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import authRoute from "./routes/auth.route";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);

app.use("/api/auth/", authRoute);
