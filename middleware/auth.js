const { _readDb } = require("../models/gallery.models");
const jwt = require("jsonwebtoken");
const config = require("config/auth.config.json");

const checkToken = async (req, res, next) => {
  console.log("Data 1", req.cookies.accessToken);
  const req_token = req.cookies.accessToken;
  let auth = false;
  if (!req_token) {
    return res.status(200).json({ message: "Please login" });
  }

  try {
    if (!jwt.verify(req_token, config.secret)) {
      throw "Token not valid";
    } else {
      auth = true;
    }
  } catch (error) {
    console.log("invalid token");
  }

  if (!auth) {
    return res.status(400).json({ message: "token verification failed" });
  } else {
    next();
    //     const data = jwt.verify(req_token, config.secret);
    //     const user = await _readDb("users", "*", {
    //       id: data.id,
    //     });
    //     if (!user) {
    //       return res.status(400).json({ error: "user not found" });
    //     }
    //     const { id, first_name, last_name, email, role } = user[0];
    //     return res.status(200).json({
    //       userId: id,
    //       first_name: first_name,
    //       last_name: last_name,
    //       email: email,
    //       role: role,
    //     });
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

// module.exports = {
//   checkToken,
//   isAdmin,
//   isAuthor,
//   isUser,
// };
