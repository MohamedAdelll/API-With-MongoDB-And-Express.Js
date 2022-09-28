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
    type: String,
    unique: true,
    required: [true, "A user must have a username!"],
  },
  password: {
    type: String,
    minlength: [8, "Please provide a name with more than 8 characters"],
    required: [true, "A user must have a password!"],
    select: false,
  },
});

userSchema.methods.signToken = (id) => jwt.sign(id, process.env.JWT_SECRET);

userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password + process.env.SALT, this.password);
};

// userSchema.pre(/^find/, async function (next) {
//   await this.find(
//     {},
//     {
//       _id: {
//         $toString: "$_id",
//       },
//     }
//   );
//   next();
// });

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password + process.env.SALT, 12);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
