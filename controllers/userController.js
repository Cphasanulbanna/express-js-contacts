const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const User = require("../models/userModel");

// @desc register a user
// @route POST : /api/users/register/
// @access : public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  // hash password using bcrypt library
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("user data is not valid");
  }
  res.json({ message: "register the user" });
});

// @desc login
// @route POST : /api/users/login/
// @access : public
var refreshTokens = [];

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await User.findOne({ email });

  // compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.push(refreshToken);
    res.status(200).json({ accessToken, refreshToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

const getToken = asyncHandler(async (req, res) => {
  const refreshToken = await req.body.token;

  if (refreshToken == null) {
    res.status(404);
    throw new Error("empty token");
  }
  if (!refreshTokens.includes(refreshToken)) {
    res.status(403);
    throw new Error("token not included in token array");
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    function (err, user) {
      if (err) {
        res.status(403);
        throw new Error("token verification failed");
      }
      res.status(200);
      const accessToken = generateAccessToken(user);
      res.json(accessToken);
    }
  );
});

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET
  );
};

// access token generating
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "25s" }
  );
};

// @desc current
// @route GET : /api/users/current/
// @access : private

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser, getToken };
