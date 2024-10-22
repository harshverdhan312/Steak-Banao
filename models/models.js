const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = require("mongoose");

var options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

let date = new Date();

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    motive: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      possibleValues: ["Coding", "Art", "Health"],
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date().toLocaleDateString("en-US", options),
    },
    streakCounter: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const userModel = mongoose.model("user", userSchema);
exports.UserModel = userModel;
