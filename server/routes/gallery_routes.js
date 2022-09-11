const express = require("express");
const {
  getInfo,
  getCourseList,
  addInfo,
  insertNewUser,
  updateInfo,
} = require("controllers/gallery_controllers");

const router = express.Router();

router.get("/read", getInfo);
router.get("/read_course", getCourseList);
router.get("/write", addInfo);
router.post("/write/user", insertNewUser);
router.get("/update", updateInfo);

module.exports = router;
