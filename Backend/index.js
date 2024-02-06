import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";

//Connection made to Mongo Db
mongoose
  .connect(process.env.Mongo_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("Error connecting"));

//Express
const app = express();
//To send json data to server we haved used it.
app.use(express.json());
// This is a cookie parser
app.use(cookieParser());
app.listen(3000, () => {
  console.log("Server is running on port 3000!!");
});

//Api route
app.use("/Backend/user", userRouter);
app.use("/Backend/auth", authRouter);
app.use("/Backend/listing", listingRouter);

//This is a middle ware to handle error ino our code
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
