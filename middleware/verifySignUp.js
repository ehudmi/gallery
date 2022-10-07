const jwt = require("jsonwebtoken");
const config = require("../auth.config");
const { _readDb, _insertDb, _updateDb } = require("../models/gallery_models");

const checkEmail = async (req, res, next) => {
  // Email
  try {
    let result = await _readDb("users", "*", { email: req.body.email });
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Failed! Email is already in use!" });
  }
  next();
};

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = { checkEmail, verifyToken };
