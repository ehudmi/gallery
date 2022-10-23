const { _readDb, _insertDb, _updateDb } = require("../models/gallery.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config/auth.config.json");

const register = async (req, res) => {
  // console.log(req.body);
  const { first_name, last_name, email, password, birth_date, about } =
    req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  // console.log(hashPassword);
  const isStudent = async () => {
    const response = await _readDb("students", "*", {
      email: email,
    });
    // console.log(response);
    return response ? "author" : "user";
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
  } catch (e) {
    res.status(404).json({ msg: "Email already exists" });
  }
};

const login = async (req, res) => {
  try {
    const user = await _readDb("users", "*", {
      email: req.body.email,
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });
    const { id, first_name, last_name, email, role } = user[0];
    const accessToken = jwt.sign(
      { id, first_name, last_name, email, role },
      config.secret,
      {
        expiresIn: "60s",
      }
    );
    console.log("accessToken", accessToken);
    // const cookie = req.cookies.accessToken;

    // if (cookie == undefined) {
    //   res.cookie("accessToken", accessToken, {
    //     httpOnly: true,
    //     maxAge: 60 * 1000,
    //   });
    // }
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 60 * 1000,
    });
    res.json({
      userId: id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      role: role,
      accessToken: accessToken,
    });
  } catch (e) {
    res.status(404).json({ msg: "Email not found" });
  }
};

const checkToken = async (req, res) => {
  console.log("Data 1", req.cookies.accessToken);
  const req_token = req.cookies.accessToken;
  let auth = false;
  if (!req_token) {
    return res.status(200).json({ message: "Please login" });
  }
  try {
    if (!jwt.verify(req_token, config.secret)) {
      throw "Token not valid";
    } else {
      auth = true;
    }
  } catch (error) {
    console.log("invalid token");
  }
  if (!auth) {
    return res.status(400).json({ message: "token verification failed" });
  } else {
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
  }
};

const logout = (req, res) => {
  res.json({ msg: "logout" });
};

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

// const getInfo = async (req, res) => {
//   try {
//     let result = await _readDb("users", "*", { first_name: "Ehud" });
//     console.log(result);
//     res.send(result);
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ msg: "couldn't read" });
//   }
// };

// const getCourseList = async (req, res) => {
//   try {
//     let result = await _readDb("courses", "*", { id: "1" }, null, null);
//     console.log(result);
//     res.send(result);
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ msg: "couldn't read" });
//   }
// };

// const addInfo = async (req, res) => {
//   try {
//     let result = await _insertDb("authors", {
//       first_name: "Ehud",
//       last_name: "Miron",
//       email: "ehudmi1@yahoo.com",
//       birthdate: "1966-12-03",
//       about: "the new guy",
//     });
//     console.log(result);
//     res.send("added info");
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ msg: "couldn't insert" });
//   }
// };

// const updateInfo = async (req, res) => {
//   try {
//     let result = await _updateDb(
//       "authors",
//       { email: "ehudmi12@gmail.com" },
//       { first_name: "Ehud" }
//     );
//     console.log(result);
//     res.send("info updated");
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ msg: "couldn't update" });
//   }
// };

module.exports = {
  // getInfo,
  // getCourseList,
  // addInfo,
  // insertNewUser,
  // updateInfo,
  register,
  login,
  checkToken,
  logout,
  getUsers,
};
