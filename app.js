const express = require("express");
const mongoose = require("mongoose");
const { join } = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("cookie-session");
require("dotenv").config();
const { UserModel } = require("./models/models");
const app = express();

const port = process.env.PORT || 5500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");updateStreaks
app.set("views", join(__dirname, "views"));
app.use(express.static(join(__dirname, "public")));

mongoose.connect(process.env.MONGO_URL);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/createuser", async (req, res) => {
  try {
    const { name, email, password, motive, domain, days } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      motive,
      domain,
      days,
      registrationDate: new Date(),
    });

    await newUser.save();
    req.session.data = { name, email, motive, domain, days };
    res.status(200).redirect("/main");
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate email error
      return res.status(400).redirect("/signup?error=email-taken");
    }
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user: " + error.message);
  }
});

app.post("/check", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).redirect("/login?error=user-not-found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).redirect("/login?error=incorrect-password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    req.session.data = {
      name: user.name,
      email: user.email,
      motive: user.motive,
      domain: user.domain,
      days: user.days,
    };
    res.redirect("/main");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send(error);
  }
});

app.get("/main", async (req, res) => {
  if (!req.session.data) {
    return res.redirect("/login");
  }

  const { email } = req.session.data;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.redirect("/login");
    }

    const { name, motive, domain, streakCounter, days } = user;
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date();

    res.render("mainpage", {
      name,
      email,
      day: date.toLocaleDateString("en-US", options),
      days: streakCounter,
      motive,
      domain,
      totaldays: days,
    });
  } catch (error) {
    console.error("Error loading main page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running at: http://127.0.0.1:${port}`);
});
