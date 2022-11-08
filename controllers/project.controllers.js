const {
  _readDb,
  _insertDb,
  _updateDb,
  _getJoinData,
  _readDbNotNull,
} = require("../models/gallery.models");
const jwt = require("jsonwebtoken");
const config = require("config/auth.config.json");

const getUserProjects = async (req, res) => {
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
    // const data = jwt.verify(req.cookies.accessToken, config.secret);
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
      res.send({ msg: "added info" });
    }
    // res.send({ msg: "added info" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't insert" });
  }
};

// const insertNewUser = async (req, res) => {
//   console.log(await req.body);
//   try {
//     let result = await _insertDb("users", req.body);
//     console.log(result);
//     res.send("added info");
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ msg: "couldn't insert" });
//   }
// };

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
  getUserProjects,
  getProjectsList,
  getInfo,
  getCourseList,
  addProject,
  updateInfo,
};
