const express = require('express');
const router = express.Router();
const accountMethods = require("./account");

router.get("/username", accountMethods.getUsername);

module.exports = router;