const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();
const userRoute = require('./routes/routes')
const {connectDB} = require("./config/dbConnect");

const app = express();

connectDB()

port = process.env.PORT || 3000;

app.use('/api/users',userRoute)


app.listen(port,()=>{
    console.log("Server started on port 3000");
})