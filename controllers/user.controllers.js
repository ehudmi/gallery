const {
  _readDb,
  _readDb_Limited,
  _readDb_LimitedWhereNot,
  _readDbWhereNot,
  _searchAuthorsDb,
  _insertDb,
  _get2TabJoinData,
  _deleteDb,
} = require("../models/gallery.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const config = require("../config/auth.config.json");

// function to verify token from front-end

const authUser = async (req, res) => {
  const req_token = req.cookies.accessToken;
  const data = jwt.verify(req_token, process.env.JWT_SECRET);
  try {
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
    const response = await _readDb("students", "*", {
      email: email,
    });
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
    const user = await _readDb("users", "*", {
      email: req.body.email,
    });
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

// test function to return list of users - can be used by admin

const getUsers = async (req, res) => {
  const data = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
  // console.log(req.body.limit, req.body.offset);
  try {
    const users = await _readDb_LimitedWhereNot(
      "users",
      ["id", "first_name", "last_name", "email", "role", "birth_date", "about"],
      { id: data.id },
      req.body.limit,
      req.body.offset
    );
    return res.send(users);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read users" });
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
      ["id", "first_name", "last_name", "email", "role"],
      { id: data.id },
      { role: "author" }
    );
    return res.json(result);
  } catch (e) {
    res.json({ msg: "not" });
  }
};

// function to retrieve list of authors by search term

const searchAuthors = async (req, res) => {
  const selectedData = [];
  try {
    const result = await _searchAuthorsDb(
      "users",
      ["id", "first_name", "last_name", "role", "about"],
      { role: "author" },
      "first_name",
      `%${req.body.search_term}%`,
      "last_name"
    );
    result.map((item) => {
      selectedData.push({
        id: item.id,
        name: `${item.first_name} ${item.last_name}`,
        role: item.role,
        about: item.about,
      });
    });
    result.length !== 0
      ? res.send(selectedData)
      : res.send({ error: "no project matches search term" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't search users" });
  }
};

// function to retrieve list of comments authored by user

const getUserComments = async (req, res) => {
  // const data = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
  try {
    const result = await _get2TabJoinData(
      "user_comments",
      "projects",
      "user_comments.project_id",
      "projects.id",
      { user_id: req.body.id }
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
  getUsers,
  deleteUser,
  getAuthors,
  searchAuthors,
  getUserComments,
  deleteComment,
  authUser,
};
