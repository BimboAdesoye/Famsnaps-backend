const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel");

const registerUserController = async (req, res) => {
  const { name, email, password, bio } = req.body;
  try {
    if (!name || !email || !password || !bio) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Please enter a valid email" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt with cost factor 10
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    const newUser = new User({  
      name,
      email,
      password: hashedPassword,
      bio,
    });

    await newUser.save(); // Save

    // Create the JWT payload
    const payload = { userId: newUser._id };

    // Sign the JWT token with a secret key and set an expiration (e.g., 1 hour)
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Registered successfully");
    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

module.exports = { registerUserController };
