import User from "./../model/userModel.js";

function createAndSendCookie(user, res) {
  const cookieOptions = {
    httpOnly: true,
    expires: false,
    secure: true,
  };
  const token = user.signToken(user._id.toHexString());
  res.cookie("jwt_sent", token, cookieOptions);
}

function logoutUser(req, res) {
  req.user = undefined;
  res.clearCookie("jwt_sent");
  res.json({
    status: "success",
    message: "User successfuly logged out",
  });
}

async function getAllUsers(_, res, next) {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (err) {
    return next(new Error(err.message));
  }
}

async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    return next(new Error(error.message));
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { body } = req;
    const user = await User.findByIdAndUpdate(id, body, {
      runValidators: true,
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    return next(new Error(error.message));
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id, body);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
}

async function createUser(req, res, next) {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    return next(new Error(error.message));
  }
}

async function loginUser(req, res, next) {
  try {
    if (req.cookies.jwt_sent)
      return next(
        new Error("A user is already signed in. Please log out first! 401")
      );
    const { username, password } = req.body;

    if (!username || !password)
      return next(new Error("Please enter your username and password"));

    const user = await User.findOne({ username }).select("+password");
    if (!user || !(await user.comparePasswords(password)))
      return next(
        new Error("Username or password are not correct. Please try again")
      );
    createAndSendCookie(user, res);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(new Error(error.message));
  }
}

export default {
  logoutUser,
  loginUser,
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
};
