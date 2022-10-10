const { _readDb, _insertDb, _updateDb } = require("../models/gallery.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config/auth.config.json");

const register = async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await _insertDb("users", {
      email: email,
      password: hashPassword,
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
    const userId = user[0].id;
    const email = user[0].email;
    const role = user[0].role;
    const accessToken = jwt.sign({ userId, email, role }, config.secret, {
      expiresIn: "60s",
    });
    console.log("accessToken", accessToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 60 * 1000,
    });
    res.json({ accessToken });
  } catch (e) {
    res.status(404).json({ msg: "Email not found" });
  }
};

const logout = (req, res) => {
  res.json({ msg: "logout" });
};

const getUsers = async (req, res) => {
  try {
    const users = await _readDb("users", ["id", "email", "password", "role"]);
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
  logout,
  getUsers,
};
