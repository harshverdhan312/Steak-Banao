const mongoose = require('mongoose');
const {Schema} = require("mongoose");


const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    motive:{
        type:String,
        required:true
    },
    domain:{
        type:String,
        possibleValues:["Coding","Art","Health"],
        required:true,
    },
    days:{
        type:Number,
        required:true,
    },
    wantToDo:{
        type:Boolean,
        required:true,
    }
},{timestamps: true})


const userModel = mongoose.model("user", userSchema);
exports.UserModel = userModel;