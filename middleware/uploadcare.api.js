const multer = require("multer");
const uploadcareStorage = require("multer-storage-uploadcare");

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

const handleAPI = { upload: upload, delete: deleteFromAPI };
module.exports = { handleAPI };
