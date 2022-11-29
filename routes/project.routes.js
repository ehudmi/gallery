const express = require("express");

const {
  authUser,
  getAuthorProjects,
  getProjectsList,
  // getInfo,
  getCourseList,
  addProject,
  addImages,
  getProjectImages,
  getProjectComments,
  deleteImages,
  addComment,
  deleteComment,
  // updateInfo,
} = require("../controllers/project.controllers");

const { authJwt } = require("../middleware/auth");
const { handleAPI } = require("../middleware/uploadcare.api");

const router = express.Router();

// authentication route for persistent

router.get("/auth", [authJwt.checkToken], authUser);

// routes available to User

router.get("/list_projects", [authJwt.isUser], getProjectsList);
router.post("/project_images", [authJwt.checkToken], getProjectImages);
router.post("/project_comments", [authJwt.checkToken], getProjectComments);
router.post("/add_comment", [authJwt.checkToken], addComment);
router.post("/delete_comment", [authJwt.checkToken], deleteComment);

// routes available to Author

router.get("/author_projects", [authJwt.isAuthor], getAuthorProjects);
router.get("/read_course", [authJwt.isAuthor], getCourseList);
router.post("/add_project", [authJwt.isAuthor], addProject);
router.post("/add_images", [authJwt.isAuthor], [handleAPI.upload], addImages);
router.post(
  "/delete_images",
  [authJwt.isAuthor],
  [handleAPI.delete],
  deleteImages
);

// router.get("/update", updateInfo);
// router.get("/read", getInfo);

module.exports = router;
