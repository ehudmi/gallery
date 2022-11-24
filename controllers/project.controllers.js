const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: 1024 * 1024 });

const {
  _readDb,
  _readDbNotNull,
  // _readDb_Limited,
  _countRows,
  _insertDb,
  _updateDb,
  _deleteDb,
  _getJoinData,
} = require("../models/gallery.models");
const jwt = require("jsonwebtoken");
const config = require("config/auth.config.json");

// function to verify token from front-end

const authUser = async (req, res) => {
  const req_token = req.cookies.accessToken;
  const data = jwt.verify(req_token, config.secret);
  const user = await _readDb("users", "*", {
    id: data.id,
  });
  if (!user) {
    return res.status(400).json({ error: "user not found" });
  }
  const { id, first_name, last_name, email, role } = user[0];
  return res.status(200).json({
    userId: id,
    first_name: first_name,
    last_name: last_name,
    email: email,
    role: role,
  });
};

const getAuthorProjects = async (req, res) => {
  try {
    const data = jwt.verify(req.cookies.accessToken, config.secret);
    let result = await _getJoinData(
      "project_authors",
      "users",
      "projects",
      "project_authors.user_id",
      "users.id",
      "project_authors.project_id",
      "projects.id",
      { user_id: data.id }
    );
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
};

const getProjectsList = async (req, res) => {
  try {
    let result = await _readDbNotNull("projects", "*", "id");
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
};

const getInfo = async (req, res) => {
  try {
    let result = await _readDb("users", "*", { first_name: "Ehud" });
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read" });
  }
};

const getCourseList = async (req, res) => {
  try {
    let result = await _readDbNotNull("courses", "*", "id");
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read" });
  }
};

const addProject = async (req, res) => {
  const { project_name, course_id, description } = req.body;
  const data = jwt.verify(req.cookies.accessToken, config.secret);
  try {
    let insertProj = await _insertDb("projects", {
      project_name: project_name,
      course_id: course_id,
      description: description,
    });
    console.log(insertProj[0].id);
    if (insertProj.length > 0) {
      let insertProjAuthor = await _insertDb("project_authors", {
        project_id: insertProj[0].id,
        user_id: data.id,
      });
      console.log(insertProjAuthor);
      res.send(insertProjAuthor);
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't insert" });
  }
};

const addImages = async (req, res) => {
  console.log(req.body);
  const fieldsToInsert = req.body.map((field) => ({
    uuid: field.uuid,
    url: field.url,
    project_id: field.project_id,
    name: field.name,
  }));
  try {
    let checkImageCount = await _countRows("project_images", "uuid", {
      project_id: req.body[0].project_id,
    });
    console.log(checkImageCount[0].count);
    if (checkImageCount[0].count < 3) {
      let insertImage = await _insertDb("project_images", fieldsToInsert);
      console.log(insertImage);
      res.send({ message: `inserted ${insertImage.length} images` });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't insert images" });
  }
};

const imagesToAPI = async (req, res) => {
  try {
    upload.array("photos", 3);
    console.log(req.body);
    res.send();
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "didn't get the files" });
  }

  // const response=fetch("https://upload.uploadcare.com/base/",
  // {
  //   "UPLOADCARE_PUB_KEY": UPLOADCARE_PUB_KEY,
  //   "UPLOADCARE_STORE": "auto",

  //   "my_file.jpg": "@my_file.jpg",
  //   "another_file.jpg": "@another_file.jpg",
  //   "metadata[subsystem]": "uploader"
  // }
  // )
};

const getProjectImages = async (req, res) => {
  try {
    let result = await _readDb("project_images", "*", {
      project_id: req.body.project_id,
    });
    console.log(result);
    if (result.length === 0) throw error;
    else {
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't retrieve images" });
  }
};

const deleteImages = async (req, res) => {
  try {
    let result = await _deleteDb("project_images", {
      uuid: req.body.uuid,
    });
    console.log(result);
    res.send({ message: "deleted the image" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't delete images" });
  }
};

const updateInfo = async (req, res) => {
  try {
    let result = await _updateDb(
      "authors",
      { email: "ehudmi12@gmail.com" },
      { first_name: "Ehud" }
    );
    console.log(result);
    res.send("info updated");
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't update" });
  }
};

module.exports = {
  authUser,
  getAuthorProjects,
  getProjectsList,
  getInfo,
  getCourseList,
  addProject,
  addImages,
  getProjectImages,
  deleteImages,
  updateInfo,
  imagesToAPI,
};
