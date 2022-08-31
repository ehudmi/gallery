const express = require("express");
// const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const router = require("./routes/galleryroutes");

dotenv.config({ path: "C:/Github/gallery/server/.env" });

const app = express();

app.listen(process.env.PORT || 8080, () => {
  console.log(`server is running on port ${process.env.PORT || 8080}`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cors());

app.use("/", router);

// user request => middleware => response

// const logger = (req, res, next) => {
//   console.log(req.url);
//   console.log(req.method);
//   console.log(req.params);
//   console.log(req.query);
//   console.log(req.body);
//   next();
// };
