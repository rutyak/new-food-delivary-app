const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiRouter = require("./router/apiRouter");
require("dotenv").config();

const app = express();

const port = process.env.PORT;
const mongodb_url = process.env.MongoDB_URL;

app.use(cors());
app.use(express.json());

mongoose
  .connect(mongodb_url)
  .then(() => {
    console.log("Connections established successfully!!");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(apiRouter);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
