const express = require("express");
// const cors = require("cors");
const dotenv = require("dotenv");
// const bodyParser = require("body-parser");
// const router = require("./routes/phrases.js");

// if (process.env.NODE_ENV === "production") {
//   //set static folder
//   app.use(express.static("client/build"));
// }
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// });

dotenv.config({ path: "C:/Github/gallery/server/.env" });

const app = express();

app.listen(process.env.PORT || 8080, () => {
  console.log(`server is running on port ${process.env.PORT || 8080}`);
});

// app.use("/", express.static(__dirname + "/public"));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cors());

// app.use("/api/phrases", router);

// user request => middleware => response

// const logger = (req, res, next) => {
//   console.log(req.url);
//   console.log(req.method);
//   console.log(req.params);
//   console.log(req.query);
//   console.log(req.body);
//   next();
// };

// app.get("/about", logger, (req, res) => {
//   res.send("requests page");
// });
