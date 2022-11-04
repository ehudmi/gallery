const express = require("express");
const {
  getUserProjects,
  getProjectsList,
  getInfo,
  getCourseList,
  addProject,
  // insertNewUser,
  updateInfo,
} = require("../controllers/project.controllers");
const { authUser } = require("../controllers/user.controllers");
const { authJwt } = require("../middleware/auth");

const router = express.Router();

router.use(authJwt.checkToken);
router.get("/auth", authUser);
router.get("/user_projects", [authJwt.isAuthor], getUserProjects);
router.get("/list_projects", [authJwt.isUser], getProjectsList);
// router.get("/user_projects", getUserProjects);
router.get("/read", getInfo);
router.get("/read_course", [authJwt.isAuthor], getCourseList);
router.post("/add_project", [authJwt.isAuthor], addProject);
// router.post("/register", insertNewUser);
router.get("/update", updateInfo);

module.exports = router;
