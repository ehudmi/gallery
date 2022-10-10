const express = require("express");
const {
  // getInfo,
  //   getCourseList,
  // updateInfo,
  // addInfo,
  register,
  login,
  logout,
  getUsers,
} = require("../controllers/user.controllers");

const router = express.Router();

// router.get("/read", getInfo);
// router.get("/read_course", getCourseList);
// router.get("/write", addInfo);
// router.get("/update", updateInfo);
router.get("/users", getUsers);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
