const express = require("express");

const {
  authUser,
  getAuthorProjects,
  getProjectsList,
  getInfo,
  getCourseList,
  addProject,
  addImages,
  getProjectImages,
  deleteImages,
  updateInfo,
} = require("../controllers/project.controllers");

const { authJwt } = require("../middleware/auth");
const { upload, deleteFromAPI } = require("../middleware/uploadcare.api");

const router = express.Router();

router.get("/auth", [authJwt.checkToken], authUser);

router.get("/list_projects", [authJwt.isUser], getProjectsList);
router.post("/project_images", [authJwt.checkToken], getProjectImages);
router.post("/delete_images", [authJwt.isAuthor], deleteFromAPI, deleteImages);

router.get("/author_projects", [authJwt.isAuthor], getAuthorProjects);
router.get("/read_course", [authJwt.isAuthor], getCourseList);
router.post("/add_project", [authJwt.isAuthor], addProject);
router.post(
  "/add_images",
  [authJwt.isAuthor],
  upload.array("images", 3),
  addImages
);

router.get("/update", updateInfo);
router.get("/read", getInfo);

module.exports = router;
