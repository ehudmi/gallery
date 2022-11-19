const {
  _readDb,
  _readDbNotNull,
  // _readDb_Limited,
  _countRows,
  _insertDb,
  _updateDb,
  _getJoinData,
} = require("../models/gallery.models");
const jwt = require("jsonwebtoken");
const config = require("config/auth.config.json");

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
  getAuthorProjects,
  getProjectsList,
  getInfo,
  getCourseList,
  addProject,
  addImages,
  updateInfo,
};
