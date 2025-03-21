const express = require("express");
const router = express.Router();
const mysqlDB = require('../database/databaseInfo.js');

router.get("/signUp", (req, res) => {
    res.send("login API")
});



module.exports = router;