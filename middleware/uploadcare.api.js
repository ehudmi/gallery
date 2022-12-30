const multer = require("multer");
const uploadcareStorage = require("multer-storage-uploadcare");
const {
  _readDbSingleAuthor,
  _readDbList,
} = require("../models/gallery.models.js");

// middleware for uploading images to Uploadcare

const fileStorageEngine = uploadcareStorage({
  public_key: process.env.API_PUB_KEY,
  private_key: process.env.API_SEC_KEY,
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
        Authorization: `Uploadcare.Simple ${process.env.API_PUB_KEY}:${process.env.API_SEC_KEY}`,
      },
    }
  );
  const json = await response.json();
  next();
};

// middleware for deleting images from Uploadcare when deleting author or single author project

const getProjectList = async (req, res, next) => {
  const user_id = req.body.user_id;
  try {
    const projectList = await _readDbSingleAuthor(
      "project_authors",
      ["project_id"],
      {
        user_id: user_id,
      }
    );
    const list = projectList.map((item) => item.project_id);
    req.body.project_id = list;
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
  next();
};

const getImageList = async (req, res, next) => {
  const project_id = req.body.project_id;
  try {
    const picList = await _readDbList(
      "project_images",
      ["uuid"],
      ["project_id"],
      project_id
    );
    const list = picList.map((item) => item.uuid);
    list.length > 0 ? (req.body.list = list) : (req.body.list = "");
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read images" });
  }
  next();
};

const deleteBatchFromAPI = async (req, res, next) => {
  if (req.body.list !== "") {
    try {
      const list = JSON.stringify(req.body.list);
      const response = await fetch(
        `https://api.uploadcare.com/files/storage/`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/vnd.uploadcare-v0.7+json",
            Authorization: `Uploadcare.Simple ${process.env.API_PUB_KEY}:${process.env.API_SEC_KEY}`,
            "Content-Type": "application/json",
          },
          body: list,
        }
      );
      const json = await response.json();
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: "couldn't delete images" });
    }
  } else null;
  next();
};

const handleAPI = {
  upload: upload,
  delete: deleteFromAPI,
  getProjects: getProjectList,
  getImages: getImageList,
  deleteBatch: deleteBatchFromAPI,
};
module.exports = { handleAPI };
