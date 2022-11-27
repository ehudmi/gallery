// require("rootpath")();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const app = express();

dotenv.config({ path: "C:/GitHub/gallery/.env" });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use("/users", require("../routes/user.routes"));
app.use("/projects", require("../routes/project.routes"));

// global error handler
// app.use(errorHandler);

// user request => middleware => response

app.listen(process.env.PORT || 8080, () => {
  console.log(`server is running on port ${process.env.PORT || 8080}`);
});
