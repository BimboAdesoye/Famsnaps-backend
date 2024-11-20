const express = require("express");
const router = express.Router();

const { registerUserController } = require("../controllers/userController");

router.post("/register", registerUserController);

module.exports = router;
