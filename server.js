import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routers/userRoutes.js";

const port = process.env.PORT || 2020;
const app = express();

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend domain
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow these methods
    allowedHeaders: "Content-Type, Authorization", // Allow these headers
    credentials: true, // Allow cookies if needed
  })
);

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    allowedOrigins.includes(req.headers.origin) ? req.headers.origin : "false"
  );
  console.log(req.headers.origin)
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ Handle OPTIONS requests properly
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// app.options("*", cors()); // Respond to preflight requests

app.use(express.json());
app.use(cookieParser());

app.use("/auth", userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
