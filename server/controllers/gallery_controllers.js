const { readDb, insertDb, updateDb } = require("modules/gallery_modules");

const getInfo = async (req, res) => {
  try {
    let result = await readDb("users", "*", { first_name: "Ehud" });
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "couldn't read" });
  }
};

const getCourseList = async (req, res) => {
  try {
    let result = await readDb("courses", "*", { id: "1" }, null, null);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "couldn't read" });
  }
};

const addInfo = async (req, res) => {
  try {
    let result = await insertDb("authors", {
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

const insertNewUser = async (req, res) => {
  console.log(await req.body);
  try {
    let result = await insertDb("users", req.body);
    console.log(result);
    res.send("added info");
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "couldn't insert" });
  }
};

const updateInfo = async (req, res) => {
  try {
    let result = await updateDb(
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

module.exports = { getInfo, getCourseList, addInfo, insertNewUser, updateInfo };
