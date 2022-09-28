import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "You forgot to type anything!"],
    trim: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: function () {
      return new Date();
    },
  },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
