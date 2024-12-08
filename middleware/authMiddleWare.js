const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expecting format: "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info from the token to req.user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protect };