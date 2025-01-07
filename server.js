// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config(); // This will load the variables from the .env file and import them into the process.env variable in our application.
// }

import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
const port = process.env.PORT || 2020;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

import userRoutes from "./routers/userRoutes.js";

app.use("/auth", userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
