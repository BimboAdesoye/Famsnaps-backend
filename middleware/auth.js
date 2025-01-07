import jwt from "jsonwebtoken"; 

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
   if (!token) {
     console.log("Must be logged in to view the page");
     res.status(401).json({ status: "false", errMessage: "unauthorized" });
     return;
   }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ errMessage: "Token is not valid. Unauthorized" });
  }
};

export default authMiddleware;


// jwt.verify(token, process.env.JWT_secret, (err, decoded) => {
//   if (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
//   req.userId = decoded.id;
//   next();
// });