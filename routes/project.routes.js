const express = require("express");

const {
  authUser,
  searchProjects,
  getAuthorProjects,
  getMyProjects,
  getProjectsList,
  getProjectDetails,
  getCourseList,
  addProject,
  deleteProject,
  addImages,
  getProjectImages,
  getProjectComments,
  deleteImages,
  addComment,
  deleteComment,
} = require("../controllers/project.controllers");

const { authJwt } = require("../middleware/auth");
const { handleAPI } = require("../middleware/uploadcare.api");

const router = express.Router();

// authentication route for persistent

router.get("/auth", [authJwt.checkToken], authUser);

// routes available to User

router.post("/projects_list", [authJwt.checkToken], getProjectsList);
router.post("/project_details", [authJwt.checkToken], getProjectDetails);
router.post("/project_images", [authJwt.checkToken], getProjectImages);
router.post("/project_comments", [authJwt.checkToken], getProjectComments);
router.post("/add_comment", [authJwt.checkToken], addComment);
router.post("/delete_comment", [authJwt.checkToken], deleteComment);
router.post("/search", [authJwt.checkToken], searchProjects);
router.post("/author_projects", [authJwt.checkToken], getAuthorProjects);

// routes available to Author

router.post("/my_projects", [authJwt.isAuthor], getMyProjects);
router.get("/read_course", [authJwt.isAuthor], getCourseList);
router.post("/add_project", [authJwt.isAuthor], addProject);
router.post(
  "/add_images",
  [authJwt.isAuthor],
  handleAPI.upload.array("images", 3),
  addImages
);
router.post(
  "/delete_images",
  [authJwt.isAuthor],
  [handleAPI.delete],
  deleteImages
);
router.post(
  "/delete_project",
  [authJwt.isAuthor],
  [handleAPI.getImages],
  [handleAPI.deleteBatch],
  deleteProject
);

// routes available to Admin

router.post(
  "/admin_delete_project",
  [authJwt.isAdmin],
  [handleAPI.getImages],
  [handleAPI.deleteBatch],
  deleteProject
);

module.exports = router;
