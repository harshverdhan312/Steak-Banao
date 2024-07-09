const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();



port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Server started on port 3000");
})