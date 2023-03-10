const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// app.use(
//   cors({
//     credentials: true,
//     origin: "https://project-gallery-qjhs.onrender.com/",
//   })
// );

app.use("/", express.static(path.resolve(__dirname, "./client/build")));

app.use("/users", require("./routes/user.routes"));
app.use("/projects", require("./routes/project.routes"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`server is running on port ${process.env.PORT || 8080}`);
});
