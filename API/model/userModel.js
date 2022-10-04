import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name!"],
    minlength: [3, "Please provide a name with more than 3 characters"],
    trim: true,
  },
  username: {
    trim: true,
    type: String,
    unique: true,
    required: [true, "A user must have a username!"],
    validate: {
      validator: function () {
        return /\s/.test(this);
      },
      message: "You must provide username without spaces.",
    },
  },
  password: {
    trim: true,
    type: String,
    minlength: [8, "Please provide a name with more than 8 characters"],
    required: [true, "A user must have a password!"],
    select: false,
  },
});

userSchema.methods.signToken = (user) =>
  jwt.sign(JSON.stringify(user), process.env.JWT_SECRET);

userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password + process.env.SALT, this.password);
};

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password + process.env.SALT, 12);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
