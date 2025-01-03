const express = require("express");
const restauController = require("../controller/restauController");
const menuController = require("../controller/menuController");
const router = express.Router();

router.get("/restaurants", restauController)

router.get("/menu", menuController);

module.exports = router;