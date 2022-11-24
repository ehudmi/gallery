const { _readDb } = require("../models/gallery.models");
const jwt = require("jsonwebtoken");
const config = require("config/auth.config.json");

const checkToken = async (req, res, next) => {
  const req_token = req.cookies.accessToken;
  if (!req_token) {
    return res.status(200).json({ message: "Please login" });
  }
  if (!jwt.verify(req_token, config.secret)) {
    return res.status(400).json({ message: "token verification failed" });
  } else {
    next();
  }
};

const isAdmin = async (req, res, next) => {
  const data = jwt.verify(req.cookies.accessToken, config.secret);
  const user = await _readDb("users", "*", {
    id: data.id,
  });
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

const isAuthor = async (req, res, next) => {
  const data = jwt.verify(req.cookies.accessToken, config.secret);
  const user = await _readDb("users", "*", {
    id: data.id,
  });
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

const isUser = async (req, res, next) => {
  const data = jwt.verify(req.cookies.accessToken, config.secret);
  const user = await _readDb("users", "*", {
    id: data.id,
  });
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
