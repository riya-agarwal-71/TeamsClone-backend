// controller to handle the user api calls
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// function to signup a user (create a user)
module.exports.userSignUp = async function (req, res) {
  try {
    const { email, name, password, confirmPassword } = req.body;
    // if any of the required fields is missing
    if (!email || !name || !password || !confirmPassword) {
      return res.status(200).json({
        data: {
          success: false,
          message: "Please Provide the necessary fields",
          data: {},
        },
      });
    }
    // if password doesnt match with confirm password
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
    // if user already exists
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
    // if new user could not be created
    if (!newUser) {
      return res.status(500).json({
        data: {
          success: false,
          message: "Error in creating the user",
          data: {},
        },
      });
    }
    // new user created successfully
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

// function to login a user
module.exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;
    // if required fields are not present
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
    // if user doesnt exist or the password for the user doesnt match
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
    // user authenticated
    // create a jwt token
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

// function to get the groups of the user
module.exports.getGroups = async function (req, response) {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email: email }).populate("groups", [
      "_id",
      "name",
    ]);
    // if user not found
    if (!user) {
      return response.status(200).json({
        data: {
          success: false,
          message: "User not found",
          data: {},
        },
      });
    }

    // groups found successfully
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
