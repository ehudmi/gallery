const { _readDb, _insertDb, _updateDb } = require("../models/gallery.models");

const getInfo = async (req, res) => {
  try {
    let result = await _readDb("users", "*", { first_name: "Ehud" });
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "couldn't read" });
  }
};

const getCourseList = async (req, res) => {
  try {
    let result = await _readDb("courses", "*", { id: "1" }, null, null);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "couldn't read" });
  }
};

const addInfo = async (req, res) => {
  try {
    let result = await _insertDb("authors", {
      first_name: "Ehud",
      last_name: "Miron",
      email: "ehudmi1@yahoo.com",
      birthdate: "1966-12-03",
      about: "the new guy",
    });
    console.log(result);
    res.send("added info");
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "couldn't insert" });
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
    res.status(404).json({ msg: "couldn't update" });
  }
};

module.exports = { getInfo, getCourseList, addInfo, updateInfo };
