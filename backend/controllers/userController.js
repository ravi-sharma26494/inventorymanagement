const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECERET, {expiresIn:'1d'})
}

const registerUser =  asyncHandler( async(req, res)=>{
    const {name, email, password} = req.body;
    
    //validation
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please fill in all the required fields.");
    }
    if(password.length <6){
        res.status(400)
        throw new Error("Password must have atleast 6 Characters");
    }

    //check if user already exist
    const usersExists = await User.findOne({email});
    if(usersExists){
        res.status(404)
        throw new Error("Email has already been registered.")

    }

    //Encrypt password before saving
    //Now in userModel    
    //Create a new User
    const user = await User.create({
        name, 
        email, 
        password
    });

    //Generate Token
    const token  = generateToken(user._id);

    //Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1 day
        sameSite:"none",
        secure: true
    })
    if(user){
        const{_id, name, email, photo, phone, bio} = user;
        res.status(201).json({
            _id, 
            name, 
            email, 
            photo, 
            phone, 
            bio,
            token
        })
    } else{
        res.status(400)
        throw new Error("Invalid User Data")
    }

});

//Login User
const loginUser = asyncHandler( async(req, res)=>{
    const {email, password} = req.body;
    
    //Validate Requests
    if(!email || !password){
        res.status(400)
        throw new Error("Please add email and password")
    }

    //If user exists in db
    const user = await User.findOne({email})
    if(!user){
        res.status(400)
        throw new Error("No registered account was found, please register first.");
    }
    // User exixts-- now check chek if the password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password)
    
    //Generate Token
    const token  = generateToken(user._id);

    //Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1 day
        sameSite:"none",
        secure: true
    });

    if(user && passwordIsCorrect){
        const{_id, name, email, photo, phone, bio} = user;
        res.status(200).json({
            _id, 
            name, 
            email, 
            photo, 
            phone, 
            bio,
        })
    } else{
        res.status(400)
        throw new Error("Invalid email or password");

    }
});

module.exports = {
    registerUser,
    loginUser
}