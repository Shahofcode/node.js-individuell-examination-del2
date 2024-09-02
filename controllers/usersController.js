import joi from "joi";
import db from "../db/database.js";
import bcrypt from "bcrypt";

// Creates a JOI schema to validate user input
const userSchema = joi.object({
  username: joi.string().min(3).max(20).alphanum().required(),
  password: joi.string().min(3).max(20).required()
});

// Creates a new user with input validation and errorhandling
const createUser = async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, password } = req.body;

  try {
    // Checks if the username already exists
    const existingUser = await db.users.findOne({ username });
    if (existingUser) return res.status(400).send("Username already exists.");

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creates a new user with hashed password
    const newUser = { username, password: hashedPassword, isAdmin: false };

    // Saves new user
    const createdUser = await db.users.insert(newUser);
    res.status(201).json({
      message: "User created.",
      user: { id: createdUser._id, username: createdUser.username },
    });
  } catch (err) {
    res.status(500).send("Could not create user.");
  }
};

// Login controller
const login = async (req, res) => {
  // Validates users input
  const { error } = userSchema.validate(req.body);
  // Checks if validation fails
  if (error) return res.status(400).send(error.details[0].message);

  // Get username and password from request body
  const { username, password } = req.body;

  try {
    // Get information about user from database
    const user = await db.users.findOne({ username });

    // Checks if user doesn't exist in database
    if (!user)
      return res.status(401).json({
        message: `Incorrect username or password.`,
      });

    // Compares password with hashed password in database
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: `Incorrect username or password.`,
      });
    }

    // Checks if user exists in database and password is correct
    global.currentUser = { id: user._id, ...user };

    // Checks if user already exists in database
    res.status(200).json({
      message: `Login successful. Logged in user: ${username}. Id: ${user._id}.`,
    });
  } catch (error) {
    // Logging error message in console
    console.error(error);
    res.status(500).send(`Login failed.`);
  }
};

// Logout user
const logout = (req, res) => {
  global.currentUser = null;
  res.status(200).json({
    message: "Logout successful.",
  });
};

export { createUser, login, logout };
