const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      console.log("Must be logged in to view the page");
      res.status(401).json({ status: "false", errMessage: "unauthorized" });
      return;
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ errMessage: "Token is not valid. Unauthorized" });
  }
};

module.exports = authMiddleware;