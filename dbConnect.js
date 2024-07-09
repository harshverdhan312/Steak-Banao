const mongoose = require('mongoose')
require('dotenv').config();
const {userModel} = "models/models.js"

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI,)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

