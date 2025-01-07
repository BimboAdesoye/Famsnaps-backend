import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../prismaClient.js";

// Register user endpoint
export const registerUserController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
        username: username
      },
    });
    
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt with cost factor 10
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Sign the JWT token with a secret key and set an expiration (e.g., 1 hour)
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(username, password);
    res.status(201).json({ token, message: "Registered successfully" });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
};

// Login user endpoint
export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Check if the user has completed their profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    if (!profile) {
      return res.status(200).json({
        token,
        message: "Login successful. Please, complete your profile.",
        profileIncomplete: true,
        //Use this in the frontend as so: if (response.data.profileIncomplete) {
        // Redirect the user to the profile completion page
        // } else {
        // Proceed to the main dashboard
        // }
      });
    }

    res
      .status(200)
      .json({ token, message: "Login successful", profileIncomplete: false });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
};

// Complete profile endpoint
export const completeProfileController = async (req, res) => {
  const { name, bio } = req.body;
  const userId = req.userId; // The user ID is available in the request object after the user is authenticated

  try {
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    await prisma.profile.create({
      data: {
        userId,
        name,
        bio,
        // avatarUrl,
      },
    });
    res.status(201).json({ message: "Profile completed successfully" });
  } catch (error) {
    res.sendStatus(503).json({ message: "Error completing profile" });
  }
};

// export default {
//   registerUserController,
//   loginUserController,
//   completeProfileController,
// };
