const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    console.log("Authorization header is missing");
    res
      .status(401)
      .json({ success: false, error: "Authorization header is missing" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Token verification failed", error);
    return res.status(401).json({ success: false, error: "Unautorized user" });
  }
};

module.exports = { auth };
