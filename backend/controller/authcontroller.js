const User = require("../models/User");
const generateToken = require("../config/jwtConfig");

const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Email already Exisits" });
    }

    const user = new User({
      userName,
      email,
      password,
    });

    await user.save();

    const token = generateToken(user);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error("Error in registerUser:- ", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error", error });
  }
};

module.exports = { loginUser };

const logoutUser = async (req, res) => {
  res.status(200).json({ success: true, message: "Logout successful" });
};

module.exports = { registerUser, loginUser, logoutUser };
