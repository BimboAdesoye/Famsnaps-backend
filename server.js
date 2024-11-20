// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config(); // This will load the variables from the .env file and import them into the process.env variable in our application.
// }

require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 2020;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const userRoutes = require("./routers/userRoutes");

app.use("/users", userRoutes);

let db_url = process.env.DBURL;

mongoose
  .connect(db_url)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(err);   
  });

  app.get("/", (req, res) => {
    res.send("Hello, again");
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
