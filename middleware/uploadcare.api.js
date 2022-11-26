const multer = require("multer");
const uploadcareStorage = require("multer-storage-uploadcare");

const UPLOADCARE_PUB_KEY = "a8a3d493f7784d19923f";
const UPLOADCARE_SEC_KEY = "7504d155b72e01f55dbf";

// const upload = multer({ storage: multer.memoryStorage(), limits: 1024 * 1024 });

// const fileStorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./tryfiles"); //important this is a direct path fron our current file to storage location
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

const fileStorageEngine = uploadcareStorage({
  public_key: UPLOADCARE_PUB_KEY,
  private_key: UPLOADCARE_SEC_KEY,
  store: "auto", // 'auto' || 0 || 1
  metadata: { hello: "world" },
});

const upload = multer({ storage: fileStorageEngine });

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
  console.log(await response.json());
  next();
};

module.exports = { upload, deleteFromAPI };
