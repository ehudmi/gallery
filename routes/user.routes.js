const express = require("express");
const {
  register,
  login,
  logout,
  getUsers,
  deleteUser,
  getAuthors,
  searchAuthors,
  authUser,
  getUserComments,
  deleteComment,
} = require("../controllers/user.controllers");

const { authJwt } = require("../middleware/auth");

const router = express.Router();

// authentication route for persistent

router.get("/auth", [authJwt.checkToken], authUser);

// router.get("/users", getUsers);
router.get("/authors", getAuthors);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// routes available to Users

router.post("/user_comments", [authJwt.checkToken], getUserComments);
router.post("/delete_comment", [authJwt.checkToken], deleteComment);
router.post("/search", [authJwt.checkToken], searchAuthors);

// routes available to Admin
router.post("/user_list", [authJwt.isAdmin], getUsers);
router.post("/delete_user", [authJwt.isAdmin], deleteUser);

module.exports = router;
