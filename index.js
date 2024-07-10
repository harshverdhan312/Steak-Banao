const express = require('express');
const {dayShow}=require("./routes/days.routes")
require('dotenv').config();
const {userRoute} = require('./routes/routes')
const {connectToMongoDB} = require("./config/dbConnect");

const app = express();

connectToMongoDB("mongodb://127.0.0.1:27017/streaks")
    .then(()=>console.log("mongodb connected"))
    .catch(err => console.log(err));

port = process.env.PORT || 3000;

app.use(userRoute)
app.use(dayShow)


app.listen(port,()=>{
    console.log("Server started on port 3000");
})