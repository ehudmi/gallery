const express = require("express");
const {
  getInfo,
  addInfo,
  updateInfo,
} = require("../controllers/gallerycontrollers");

const router = express.Router();

router.get("/read", getInfo);
router.get("/write", addInfo);
router.get("/update", updateInfo);

module.exports = router;
