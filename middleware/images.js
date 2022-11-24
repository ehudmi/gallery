const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: 1024 * 1024 });
import { UploadClient } from "@uploadcare/upload-client";

const UPLOADCARE_PUB_KEY = "a8a3d493f7784d19923f";
const UPLOADCARE_SEC_KEY = "7504d155b72e01f55dbf";

const uploadToAPI = async (req, res, next) => {
  const client = new UploadClient({ publicKey: UPLOADCARE_PUB_KEY });
  const response = await client.uploadFileGroup(upload.array(req.files));
};

module.exports = { uploadToAPI };
