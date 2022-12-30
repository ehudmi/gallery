const {
  _readDb,
  _countRows,
  _readDb_LimitedWhere,
  _readDbWhereNot,
  _insertDb,
  _get2TabJoinData,
  _deleteDb,
} = require("../models/gallery.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// function to verify token from front-end

const authUser = async (req, res) => {
  const req_token = req.cookies.accessToken;
  const data = jwt.verify(req_token, process.env.JWT_SECRET);
  try {
    const user = await _readDb("users", "*", "id", "=", data.id, "id", "ASC");
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
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "can't authenticate" });
  }
};

// function to register new user in DB

const register = async (req, res) => {
  const { first_name, last_name, email, password, birth_date, about } =
    req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  const isStudent = async () => {
    const response = await _readDb(
      "students",
      "*",
      "email",
      "=",
      email,
      "id",
      "ASC"
    );
    console.log(response);
    return response.length == 0 ? "user" : "author";
  };
  const role = await isStudent();
  try {
    await _insertDb("users", {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashPassword,
      role: role,
      birth_date: birth_date,
      about: about,
    });
    res.json({ msg: "Registered Successfully" });
  } catch (error) {
    res.status(409).json({ error: "Email already exists" });
  }
};

// function to login existing user

const login = async (req, res) => {
  try {
    const user = await _readDb(
      "users",
      "*",
      "email",
      "=",
      req.body.email,
      "id",
      "ASC"
    );
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ error: "Wrong password" });
    const { id, first_name, last_name, email, role } = user[0];
    const accessToken = jwt.sign(
      { id, first_name, last_name, email, role },
      process.env.JWT_SECRET,
      {
        expiresIn: "900s",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 900 * 1000,
    });
    res.json({
      userId: id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      role: role,
      accessToken: accessToken,
    });
  } catch (error) {
    res.status(404).json({ error: "Email not found" });
  }
};

// function for logout of current user

const logout = (req, res) => {
  res.clearCookie("accessToken");
  return res.json({ msg: "logging you out" });
};

// function to count number of users - used by admin

const getCountUsers = async (req, res) => {
  try {
    const result = await _countRows("users", "*", "id", ">", "0");
    return res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't count users" });
  }
};

// function to return list of users - used by admin

const getUsers = async (req, res) => {
  const data = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
  try {
    const users = await _readDb_LimitedWhere(
      "users",
      ["id", "first_name", "last_name", "email", "role", "birth_date", "about"],
      "id",
      "<>",
      data.id,
      req.body.limit,
      req.body.offset,
      "first_name",
      "ASC"
    );
    return res.send(users);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read users" });
  }
};

// function to add student to DB - used by admin

const addStudent = async (req, res) => {
  const { first_name, last_name, email } = req.body;
  try {
    await _insertDb("students", {
      first_name: first_name,
      last_name: last_name,
      email: email,
    });
    res.json({ msg: "Added Successfully" });
  } catch (error) {
    res.status(409).json({ error: "couldn't add student" });
  }
};

// function to add course to DB - used by admin

const addCourse = async (req, res) => {
  const { id, name, start_date, city, country } = req.body;
  try {
    await _insertDb("courses", {
      id: id,
      name: name,
      start_date: start_date,
      city: city,
      country: country,
    });
    res.json({ msg: "Added Successfully" });
  } catch (error) {
    res.status(409).json({ error: "couldn't add course" });
  }
};

// function to delete user - can be used by admin

const deleteUser = async (req, res) => {
  try {
    const result = await _deleteDb("users", {
      id: req.body.user_id,
    });
    return res.send({ message: "deleted the user" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't delete user" });
  }
};

//  function to return list of authors

const getAuthors = async (req, res) => {
  const data = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
  try {
    const result = await _readDbWhereNot(
      "users",
      ["id", "first_name", "last_name", "email", "role", "about"],
      { id: data.id },
      { role: "author" }
    );
    return res.json(result);
  } catch (e) {
    res.json({ msg: "couldn't get authors" });
  }
};

// function to retrieve list of comments authored by user

const getUserComments = async (req, res) => {
  try {
    const result = await _get2TabJoinData(
      "user_comments",
      "projects",
      "user_comments.project_id",
      "projects.id",
      { user_id: req.body.id },
      "user_comment",
      "ASC"
    );
    return res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read my comments" });
  }
};

// function to delete user comments

const deleteComment = async (req, res) => {
  try {
    const result = await _deleteDb("user_comments", {
      comment_id: req.body.comment_id,
    });
    return res.send({ message: "deleted the comment" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't delete comment" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCountUsers,
  getUsers,
  addStudent,
  addCourse,
  deleteUser,
  getAuthors,
  getUserComments,
  deleteComment,
  authUser,
};
