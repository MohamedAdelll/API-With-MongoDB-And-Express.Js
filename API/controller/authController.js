import User from "./../model/userModel.js";
import Post from "./../model/postModel.js";
import jwt from "jsonwebtoken";

async function protect(req, _, next) {
  try {
    const { jwt_sent } = req.cookies;
    if (!jwt_sent)
      return next(new Error("Invalid token! Try signing in again. 401"));
    const id = jwt.verify(jwt_sent, process.env.JWT_SECRET);
    if (!id)
      return next(
        new Error("No user found with this token! try signing in again. 404")
      );
    const user = await User.findById(id);
    if (!user)
      return next(
        new Error("Invalid token for this user! Try signing in again. 401")
      );
    req.user = user;
    next();
  } catch (error) {
    return next(new Error(error.message));
  }
}

async function restrict(req, _, next) {
  try {
    const { id } = req.params;
    console.log(id);
    const post = await Post.findById(id).populate("user", "name username");
    if (!post) return next(new Error("Invalid post Id. 400"));
    const { user } = req;
    console.log(user._id, post);
    if (user._id.toHexString() !== post.user._id.toHexString())
      return next(
        new Error("You are not allowed to perform this kind of action. 401")
      );
    req.post = post;
    next();
  } catch (error) {
    return next(new Error(error.message));
  }
}

async function restrictUserChanges(req, _, next) {
  if (req.params.id !== req.user._id.toHexString())
    return next(new Error("Not authorized! 401"));
  next();
}

export default {
  protect,
  restrict,
  restrictUserChanges,
};
