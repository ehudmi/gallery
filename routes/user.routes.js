const express = require("express");
const {
  register,
  login,
  logout,
  getUsers,
} = require("../controllers/user.controllers");

const router = express.Router();

router.get("/users", getUsers);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
