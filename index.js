const express = require('express');
const {dayShow}=require("./routes/days.routes")
require('dotenv').config();
const {userRoute} = require('./routes/routes')
const {connectToMongoDB} = require("./config/dbConnect");
const {join} = require("node:path");

const app = express();
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(express.json());
connectToMongoDB("mongodb://127.0.0.1:27017/streaks")
    .then(()=>console.log("mongodb connected"))
    .catch(err => console.log(err));

port = process.env.PORT || 3000;
try {
        app.use(userRoute)
    app.use(dayShow)
}
catch(err){
    console.log(err)
}
finally{
    app.use((req, res, next) => {
        res.render('error', { message: 'Internal Server Issue' });
    });
}
app.listen(port,()=>{
    console.log("Server started on port 3000");
})