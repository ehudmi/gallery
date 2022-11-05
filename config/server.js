﻿require("rootpath")();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
// const router = require("project/routes/project.routes");
// const errorHandler = require("users/_helpers/error-handler");
const app = express();
// const { getUsers } = require("users/user.service");

dotenv.config({ path: "C:/GitHub/gallery/gallery/.env" });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// app.use("/", router);
app.use("/users", require("routes/user.routes"));
app.use("/projects", require("routes/project.routes"));

// api routes
// app.use("/users", require("users/users.controller"));

// global error handler
// app.use(errorHandler);

// getUsers();

// user request => middleware => response

// const logger = (req, res, next) => {
//   console.log(req.url);
//   console.log(req.method);
//   console.log(req.params);
//   console.log(req.query);
//   console.log(req.body);
//   next();
// };

app.listen(process.env.PORT || 8080, () => {
  console.log(`server is running on port ${process.env.PORT || 8080}`);
});
