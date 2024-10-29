const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "5d" }
  );

  return token;
};

module.exports = generateToken;
