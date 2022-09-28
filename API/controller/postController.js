import Post from "./../model/postModel.js";

async function getAllPosts(_, res, next) {
  try {
    const posts = await Post.find().populate("user", "name username");
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: { posts },
    });
  } catch (error) {
    return next(new Error(error.message));
  }
}

function getPost(req, res) {
  const { post } = req;
  post.populate("user");
  res.status(200).json({
    status: "success",
    data: { post },
  });
}

async function updatePost(req, res, next) {
  try {
    const { post } = req;
    if (!req.body.text) return next(new Error("Please provide a text. 400"));
    post.text = req.body.text;
    const newPost = await post.save();
    res.status(200).json({
      status: "success",
      data: { post: newPost },
    });
  } catch (error) {
    return next(new Error(error.message));
  }
}
async function createPost(req, res, next) {
  try {
    const { user } = req;
    const { text } = req.body;
    if (!text) return next(new Error("Please insert a text to update! 400"));
    const post = await Post.create({ user: user._id, text });
    res.status(201).json({
      status: "success",
      data: { post },
    });
  } catch (error) {
    return next(new Error(error.message));
  }
}

async function deletePost(req, res, next) {
  try {
    const { post } = req;
    await Post.findByIdAndDelete(post._id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
}

export default {
  getAllPosts,
  getPost,
  updatePost,
  createPost,
  deletePost,
};
