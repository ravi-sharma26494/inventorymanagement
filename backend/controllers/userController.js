const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
const bcrypt = require('bcryptjs')

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
    })
    if(user){
        const{_id, name, email, photo, phone, bio} = user;
        res.status(201).json({
            _id, name, email, photo, phone, bio
        })
    } else{
        res.status(400)
        throw new Error("Invalid User Data")
    }

});

module.exports = {
    registerUser
}