const express = require('express');
const {dayShow} = require("../controllers/data.controllers")
const router = express.Router();

router.post("/", dayShow);

exports.routes = express.Router();