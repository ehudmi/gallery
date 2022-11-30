const express = require("express");
const {
  register,
  login,
  logout,
  getUsers,
  searchAuthors,
  authUser,
  getUserComments,
  deleteComment,
} = require("../controllers/user.controllers");

const { authJwt } = require("../middleware/auth");

const router = express.Router();

// authentication route for persistent

router.get("/auth", [authJwt.checkToken], authUser);

router.get("/users", getUsers);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/user_comments", [authJwt.checkToken], getUserComments);
router.post("/delete_comment", [authJwt.checkToken], deleteComment);
router.post("/search", [authJwt.checkToken], searchAuthors);

module.exports = router;
