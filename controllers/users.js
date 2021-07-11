const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports.userSignUp = async function (req, res) {
  try {
    const { email, name, password, confirmPassword } = req.body;
    if (!email || !name || !password || !confirmPassword) {
      return res.status(200).json({
        data: {
          success: false,
          message: "Please Provide the necessary fields",
          data: {},
        },
      });
    }
    if (password != confirmPassword) {
      return res.status(200).json({
        data: {
          success: false,
          message: "Passwords dont match",
          data: {},
        },
      });
    }
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(200).json({
        data: {
          success: false,
          message: "User with this email already exists",
          data: {},
        },
      });
    }
    let newUser = await User.create({
      name,
      email,
      password,
      groups: [],
    });
    if (!newUser) {
      return res.status(500).json({
        data: {
          success: false,
          message: "Error in creating the user",
          data: {},
        },
      });
    }
    return res.status(200).json({
      data: {
        success: true,
        message: "User Created successfully",
        data: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
    });
  } catch (error) {
    console.log("Error in signup api", error);
  }
};

module.exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(200).json({
        data: {
          success: false,
          message: "Please provide all the necessary details",
          data: {},
        },
      });
    }
    let user = await User.findOne({ email });
    if (!user || user.password != password) {
      return res.status(200).json({
        data: {
          success: false,
          message: "Invalid email/Password",
          data: {},
        },
      });
    }
    let id = user._id;
    let name = user.name;
    return res.status(200).json({
      data: {
        success: true,
        message: "Sign in Successful",
        data: {
          token: jwt.sign({ id, name, email }, "BlahSomething", {
            expiresIn: "1h",
          }),
          user: {
            name: user.name,
            email: user.email,
          },
        },
      },
    });
  } catch (error) {
    console.log("Error in login api", error);
  }
};

module.exports.getGroups = async function (req, response) {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email: email }).populate("groups", [
      "_id",
      "name",
    ]);
    if (!user) {
      return response.status(200).json({
        data: {
          success: false,
          message: "User not found",
          data: {},
        },
      });
    }

    return response.status(200).json({
      data: {
        success: true,
        message: "Found groups !",
        data: {
          groups: user.groups,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
