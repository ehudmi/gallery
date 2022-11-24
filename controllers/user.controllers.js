const { _readDb, _insertDb, _updateDb } = require("../models/gallery.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config/auth.config.json");

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
  console.log(role);
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
      config.secret,
      {
        expiresIn: "900s",
      }
    );
    console.log("accessToken", accessToken);
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
  res.json({ msg: "logout" });
};

// test function to return list of users - can be used by admin

const getUsers = async (req, res) => {
  try {
    const users = await _readDb("users", [
      "id",
      "first_name",
      "last_name",
      "email",
      "password",
      "role",
    ]);
    res.json(users);
  } catch (e) {
    res.json({ msg: "not" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getUsers,
};
