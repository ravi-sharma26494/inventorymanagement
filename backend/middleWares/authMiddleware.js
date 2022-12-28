const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const protect = asyncHandler(async(req, res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            res.status(401)
            throw new Error("Not Authorized, please login");
        }
        // verify token
        const verified = jwt.verify(token, process.env.JWT_SECERET);
        // GET THE USER ID FROM THE TOKE
        user = await User.findById(verified.id).select("-password")
        
        if(!user){
            res.status(401)
            throw new Error("User Not Found");
            
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401)
        throw new Error("Not authorized, please login");
    }
});

module.exports ={
    protect
}