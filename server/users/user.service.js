const config = require("config.json");
const jwt = require("jsonwebtoken");
const Role = require("_helpers/role");
const { readDbNotNull } = require("modules/gallery_modules");

// users retrieved from Gallery db and stored in local variable for efficiency
let users = [];
const getUsers = async () => {
  try {
    let result = await readDbNotNull("users", "*", "email");
    users = result;
    console.log(users);
  } catch (error) {
    console.log(error);
  }
};

// const users = [
//   {
//     id: 1,
//     email: "admin",
//     password: "admin",
//     firstName: "Admin",
//     lastName: "User",
//     role: Role.Admin,
//   },
//   {
//     id: 2,
//     email: "user",
//     password: "user",
//     firstName: "Normal",
//     lastName: "User",
//     role: Role.User,
//   },
// ];

module.exports = {
  getUsers,
  authenticate,
  getAll,
  getById,
};

async function authenticate({ email, password }) {
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token,
    };
  }
}

async function getAll() {
  return users.map((u) => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });
}

async function getById(id) {
  const user = users.find((u) => u.id === parseInt(id));
  if (!user) return;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
