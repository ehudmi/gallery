// const { json } = require("body-parser");
const multer = require("multer");
const uploadcareStorage = require("multer-storage-uploadcare");
const {
  _readDbSingleAuthor,
  // _readDb,
  _readDbList,
} = require("../models/gallery.models.js");

// Uploadcare keys

// const UPLOADCARE_PUB_KEY = "a8a3d493f7784d19923f";
// const UPLOADCARE_SEC_KEY = "7504d155b72e01f55dbf";

// middleware for adding images to Uploadcare

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
  console.log(json);
  next();
};

// const getProjectList = async (req, res, next) => {
//   const user_id = req.body.user_id;
//   try {
//     const projectList = await _readDb("project_authors", ["project_id"], {
//       user_id: user_id,
//     });
//     const list = projectList.map((item) => item.project_id);
//     req.body.project_id = list;
//     console.log(list);
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ error: "couldn't read projects" });
//   }
//   next();
// };

const getProjectList = async (req, res, next) => {
  const user_id = req.body.user_id;
  console.log(user_id);
  try {
    const projectList = await _readDbSingleAuthor(
      "project_authors",
      ["project_id"],
      {
        user_id: user_id,
      }
    );
    // const list = projectList;
    const list = projectList.map((item) => item.project_id);
    req.body.project_id = list;
    console.log(list);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
  next();
};

const getImageList = async (req, res, next) => {
  console.log(req.body.project_id);
  const project_id = req.body.project_id;
  try {
    const picList = await _readDbList(
      "project_images",
      ["uuid"],
      ["project_id"],
      project_id
    );
    const list = picList.map((item) => item.uuid);
    // console.log(list);
    // console.log(JSON.stringify(list));
    req.body.list = list;
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read images" });
  }
  next();
};

const deleteBatchFromAPI = async (req, res, next) => {
  // const list = req.body.list;
  // console.log(list);
  const list = JSON.stringify(req.body.list);
  const response = await fetch(`https://api.uploadcare.com/files/storage/`, {
    method: "DELETE",
    headers: {
      Accept: "application/vnd.uploadcare-v0.7+json",
      Authorization: `Uploadcare.Simple ${process.env.API_PUB_KEY}:${process.env.API_SEC_KEY}`,
      "Content-Type": "application/json",
    },
    // urlList:list,
    body: list,
  });
  const json = await response.json();
  console.log(json);
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
