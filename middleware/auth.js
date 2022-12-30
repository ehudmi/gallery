const { _readDb } = require("../models/gallery.models");
const jwt = require("jsonwebtoken");

// middleware for checking if token exists

const checkToken = async (req, res, next) => {
  const req_token = req.cookies.accessToken;
  if (!req_token) {
    return res.status(200).json({ message: "Please login" });
  }
  if (!jwt.verify(req_token, process.env.JWT_SECRET)) {
    return res.status(401).json({ message: "token verification failed" });
  } else {
    next();
  }
};

// middleware for checking if token exists and user role is Admin

const isAdmin = async (req, res, next) => {
  const data = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
  const user = await _readDb("users", "*", "id", "=", data.id, "id", "ASC");
  const userRole = user[0].role;
  if (userRole === "admin") {
    next();
    return;
  }
  res.status(403).send({
    message: "Require Admin Role!",
  });
  return;
};

// middleware for checking if token exists and user role is Author

const isAuthor = async (req, res, next) => {
  const data = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
  const user = await _readDb("users", "*", "id", "=", data.id, "id", "ASC");
  const userRole = user[0].role;
  if (userRole === "author") {
    next();
    return;
  }
  res.status(403).send({
    message: "Require Author Role!",
  });
  return;
};

// middleware for checking if token exists and user role is User

const isUser = async (req, res, next) => {
  const data = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
  const user = await _readDb("users", "*", "id", "=", data.id, "id", "ASC");
  const userRole = user[0].role;
  if (userRole === "user") {
    next();
    return;
  }
  res.status(403).send({
    message: "Require User Role!",
  });
  return;
};

const authJwt = {
  checkToken: checkToken,
  isAdmin: isAdmin,
  isAuthor: isAuthor,
  isUser: isUser,
};
module.exports = { authJwt };
