import jwt from "jsonwebtoken"; 

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
   if (!token) {
     res.status(401).json({ isAuthenticated: "false", message: "unauthorized" });
     return;
   }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({isAuthenticated: false, message: "Invalid token. Unauthorized" });
  }
};

export default authMiddleware;