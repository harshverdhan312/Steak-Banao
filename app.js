const express = require('express');
const mongoose =require('mongoose');
const {join} = require("node:path");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserModel} = require("./models/models");
const { ejs } = require('ejs');
const app = express();

let tasks=[]

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

mongoose.connect('mongodb://localhost:27018/streakbanao')

let date = new Date();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.set('views', join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
})
app.get('/signup', (req, res) => {
    res.render('signup');
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.post("/createuser", async (req,res)=>{
    try {
        const { name, email, password, motive, domain, days } = req.body;

        const newUser = new UserModel({
            name,
            email,
            password,
            motive,
            domain,
            days,
        });
        await newUser.save();
        res.redirect("/main",{ name, email, password, motive, domain, days })
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate email error
            return res.status(400).redirect("/");
        }
        res.status(500).send('Error registering user: ' + error.message);
    }
})


app.post('/check', async (req, res) => {
    try {
      const { email, password } = req.body; 
      const user = await UserModel.findOne({ email });
      
      if (!user) {
        return res.status(400).redirect('/login')
      }
  
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).redirect('/');
      }
 
      const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
 
      res.redirect('/main').json({token})
    } catch (error) {
      res.status(500).send(error);
    }
  });


app.get("/main",(req,res)=>{
    const { name, email, password, motive, domain, days } = req.body;
    res.render('mainpage',{
        name:name,
        email:email,
        day:date.toLocaleDateString("en-US", options),
        days:0,
        motive:motive,
        domain:domain,
        totaldays:days,
    })
})
app.post('/addtask',(req,res)=>{
    const newTask = req.body.tasks
    tasks.push(newTask)
    res.redirect('/main')
})
app.listen(5500,()=>{
    console.log(tasks);
})
