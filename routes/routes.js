const express = require('express');
const {createUser} = require("../controllers/controllers")
const router = express.Router();


router.post('/signup',createUser )

exports.routes = express.Router();