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
  imagesToAPI,
} = require("../controllers/project.controllers");

const { authJwt } = require("../middleware/auth");
const { upload } = require("../middleware/images");

const router = express.Router();

router.get("/auth", [authJwt.checkToken], authUser);

router.get("/list_projects", [authJwt.isUser], getProjectsList);
router.post("/project_images", [authJwt.isUser], getProjectImages);
router.post("/delete_images", [authJwt.isUser], deleteImages);

router.get("/author_projects", [authJwt.isAuthor], getAuthorProjects);
router.get("/read_course", [authJwt.isAuthor], getCourseList);
router.post("/add_project", [authJwt.isAuthor], addProject);
router.post("/add_images", [authJwt.isAuthor], addImages);
router.post(
  "/send_images",
  [authJwt.isAuthor],
  upload.array("images", 3),
  imagesToAPI
);

router.get("/update", updateInfo);
router.get("/read", getInfo);

module.exports = router;
