const express = require("express");
const {
  register,
  login,
  logout,
  getCountUsers,
  getUsers,
  addStudent,
  addCourse,
  deleteUser,
  getAuthors,
  authUser,
  getUserComments,
  deleteComment,
} = require("../controllers/user.controllers");

const { authJwt } = require("../middleware/auth");
const { handleAPI } = require("../middleware/uploadcare.api");

const router = express.Router();

// authentication route for persistent

router.get("/auth", [authJwt.checkToken], authUser);

// routes available to All

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// routes available to Users

router.post("/user_comments", [authJwt.checkToken], getUserComments);
router.post("/delete_comment", [authJwt.checkToken], deleteComment);
router.get("/authors", [authJwt.checkToken], getAuthors);

// routes available to Admin

router.get("/count_users", [authJwt.isAdmin], getCountUsers);
router.post("/user_list", [authJwt.isAdmin], getUsers);
router.post("/add_student", [authJwt.isAdmin], addStudent);
router.post("/add_course", [authJwt.isAdmin], addCourse);
router.post(
  "/delete_user",
  [authJwt.isAdmin],
  [handleAPI.getProjects, handleAPI.getImages],
  [handleAPI.deleteBatch],
  deleteUser
);

module.exports = router;
