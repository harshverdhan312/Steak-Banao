const express = require('express');
const mongoose =require('mongoose');
const {join} = require("node:path");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ejs } = require('ejs');
const { log } = require('node:console');
const session = require('express-session');
const cron = require('node-cron');
require('dotenv').config();
const {UserModel} = require("./models/models");
const app = express();

const port = process.env.PORT || 5500
const updateStreaks = async () => {
    const users = await UserModel.find();
    const currentDate = new Date();

    users.forEach(async user => {
        const registrationDate = new Date(user.registrationDate);
        const timeDiff = currentDate - registrationDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        // Update streak counter
        await UserModel.updateOne({ _id: user._id }, { streakCounter: daysDiff });
    });
    await Promise.all(updatePromises);
};

cron.schedule('0 0 * * *', () => {
    console.log('Running streak update task...');
    updateStreaks();
});


var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

mongoose.connect(process.env.MONGO_URL)

let date = new Date();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.set('views', join(__dirname, 'views'));

app.use(express.static('public'));

app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

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
        req.session.data = { name, email, password, motive, domain, days };
        res.status(200).redirect("/main")
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate email error
            return res.status(400).redirect("/");
        }
        console.log(res.status());
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
 
      const token = jwt.sign({ id: user._id }, '123', { expiresIn: '1h' });
      req.session.data = {
        name: user.name,
        email: user.email,
        motive: user.motive,
        domain: user.domain,
        days: user.days
    };
      res.redirect('/main')
    } catch (error) {
      res.status(500).send(error);
    }
  });

app.get("/main", async(req, res) => {
    if (!req.session.data) {
        return res.redirect('/login');
    }

    
    const { email } = req.session.data;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.redirect('/login');
        }

        const { name, motive, domain, streakCounter, days } = user;
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date();

        res.render('mainpage', {
            name: name,
            email: email,
            day: date.toLocaleDateString("en-US", options),
            days: streakCounter,
            motive: motive,
            domain: domain,
            totaldays: days,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});




app.listen(port,()=>{
    console.log(`Server running at: http://127.0.0.1:${port}`);
})
