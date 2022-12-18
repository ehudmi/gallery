const { json } = require("body-parser");
const multer = require("multer");
const uploadcareStorage = require("multer-storage-uploadcare");
const { _readDb } = require("../models/gallery.models.js");

// Uploadcare keys

const UPLOADCARE_PUB_KEY = "a8a3d493f7784d19923f";
const UPLOADCARE_SEC_KEY = "7504d155b72e01f55dbf";

// middleware for adding images to Uploadcare

const fileStorageEngine = uploadcareStorage({
  public_key: UPLOADCARE_PUB_KEY,
  private_key: UPLOADCARE_SEC_KEY,
  store: "auto", // 'auto' || 0 || 1
});
const upload = multer({ storage: fileStorageEngine });

// middleware for deleting images from Uploadcare

const deleteFromAPI = async (req, res, next) => {
  const response = await fetch(
    `https://api.uploadcare.com/files/${req.body.uuid}/storage/`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/vnd.uploadcare-v0.7+json",
        Authorization: `Uploadcare.Simple ${UPLOADCARE_PUB_KEY}:${UPLOADCARE_SEC_KEY}`,
      },
    }
  );
  next();
};

const deleteBatchFromAPI = async (req, res, next) => {
  const id = req.body.id;
  let list = [];
  const getList = async (req, res) => {
    try {
      const picList = await _readDb("project_images", ["uuid"], {
        project_id: id,
      });
      list = picList.map((item) => item.uuid);
      console.log(list);
      console.log(JSON.stringify(list));
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: "couldn't read images" });
    }
  };
  getList();
  const response = await fetch(`https://api.uploadcare.com/files/storage/`, {
    method: "DELETE",
    headers: {
      Accept: "application/vnd.uploadcare-v0.7+json",
      Authorization: `Uploadcare.Simple ${UPLOADCARE_PUB_KEY}:${UPLOADCARE_SEC_KEY}`,
      // "Content-Type": "application/json",
    },
    // urlList:list,
    list,
  });
  console.log(response);
  next();
};

const handleAPI = {
  upload: upload,
  delete: deleteFromAPI,
  deleteBatch: deleteBatchFromAPI,
};
module.exports = { handleAPI };
