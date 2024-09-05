const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) return res.send(error(400, "Name is required"));
    if (!email) return res.send(error(400, "Email is required"));
    if (!password) return res.send(error(400, "Password is required"));

    const user = await User.findOne({ email });
    if (user) {
      return res.send(error(409, "User is already registered, kindly login"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.send(success(201, "Signup successful"));
  } catch (err) {
    console.log(err);
    return res.send(error(500, err.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.send(error(400, "All fields are mandatory!"));

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.send(
        error(404, "User have not registered, kindly signup first")
      );

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.send(401, "Incorrect password!");

    const accessToken = generateToken(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      "20s"
    );
    const refreshToken = generateToken(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      "50s"
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, { accessToken }));
  } catch (err) {
    console.log(err);
    return res.send(error(500, err.message));
  }
};

const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.send(error(401, "Token in cookie is required"));
  }

  const refreshToken = cookies.jwt;
  try {
    const decoded = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    const _id = decoded._id;
    const accessToken = generateToken(
      { _id },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      "30s"
    );
    return res.send(success(200, { accessToken }));
  } catch (err) {
    console.log(err);
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(error(401, "Invalid refresh token"));
  }
};

const generateToken = (data, secretKey, time) => {
  try {
    return jwt.sign(data, secretKey, {
      expiresIn: time,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
};
