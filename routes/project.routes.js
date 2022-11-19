const express = require("express");
const {
  getAuthorProjects,
  getProjectsList,
  getInfo,
  getCourseList,
  addProject,
  addImages,
  updateInfo,
} = require("../controllers/project.controllers");
const { authUser } = require("../controllers/user.controllers");
const { authJwt } = require("../middleware/auth");

const router = express.Router();

router.use(authJwt.checkToken);
router.get("/auth", authUser);
router.get("/author_projects", [authJwt.isAuthor], getAuthorProjects);
router.get("/list_projects", [authJwt.isUser], getProjectsList);
router.get("/read", getInfo);
router.get("/read_course", [authJwt.isAuthor], getCourseList);
router.post("/add_project", [authJwt.isAuthor], addProject);
router.post("/add_images", [authJwt.isAuthor], addImages);
router.get("/update", updateInfo);

module.exports = router;
