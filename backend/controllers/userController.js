const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Token = require('../models/tokenModel');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECERET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all the required fields.");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must have atleast 6 Characters");
  }

  //check if user already exist
  const usersExists = await User.findOne({ email });
  if (usersExists) {
    res.status(404);
    throw new Error("Email has already been registered.");
  }

  //Encrypt password before saving
  //Now in userModel
  //Create a new User
  const user = await User.create({
    name,
    email,
    password,
  });

  //Generate Token
  const token = generateToken(user._id);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: "none",
    secure: true,
  });
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Validate Requests
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  //If user exists in db
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("No registered account was found, please register first.");
  }
  // User exixts-- now check chek if the password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //Generate Token
  const token = generateToken(user._id);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//LOGOUT --- USER //

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), //Expire Cookie
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successully Logged Out" });
});

// Get User Profile Data //
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

//Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // verify token
  const verified = jwt.verify(token, process.env.JWT_SECERET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});
//Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.photo = req.body.photo || photo;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  }
});

const changePassword = asyncHandler( async (req, res) => {
  const user = await User.findById(req.user._id);
  const {oldPassword, password} = req.body;
  
  if(!user){
    res.status(400); //Bad Request
    throw new Error("User not found, please signup first.");
  }
  
  //validate
  if(!oldPassword || !password){
    res.status(400); //Bad Request
    throw new Error("Please add both the fields.");
  }

  // check if old password matches the db password
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
  if(user && passwordIsCorrect){
    user.password = password;
    await user.save();
    res.status(200).send("Password Changed Successfully");
  } else{
    res.status(400)
    throw new Error("Old password is incorrect.")
  }

});

const forgotPassword = asyncHandler( async(req, res)=>{
  const {email} = req.body;
  const user = await User.findOne({email});
  
  if(!user){
    res.status(404)
    throw new Error("User doesnot exists");
  }

  //Create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  
  //Hash token before saving to db
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //save token to db
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000)
  }).save()

  //Construct a reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  //Construct reset Email:
  const message = `
    <h2>Hello ${user.name}</h2>
    <p>Click on the below link to reset your password</p>
    <p>This link is valid only for 30 minutes<p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    <p>Regards...<p>
    <p>Invent Team<p>
  `;
  
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword
};
