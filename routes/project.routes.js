const express = require("express");
const {
  getInfo,
  getCourseList,
  addInfo,
  // insertNewUser,
  updateInfo,
} = require("../controllers/project.controllers");

const router = express.Router();

router.get("/read", getInfo);
router.get("/read_course", getCourseList);
router.get("/write", addInfo);
// router.post("/register", insertNewUser);
router.get("/update", updateInfo);

module.exports = router;
