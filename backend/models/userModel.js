const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please add a name"]
    },
    email:{
        type: String,
        required: [true,"Please add an email"],
        unique:true,
        trim: true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength:[6, "Minimum 6 characters"],
        //maxLength:[24, "Maximun 24 characters are allowed"],
    },
    photo:{
        type: String,
        required: [true, "Please upload an Image for your profile"],
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    phone:{
        type:String,
        default: "+91"
    },
    bio:{
        type:String,
        default:"Bio",
        maxLength:[250, "Maximum 250 characters are allowed"],
    }
}, { timestamps:true });

//Encrypt password before saving
    userSchema.pre("save",async function(next){
        
        if(!this.isModified("password")){
            return next();
        }
        //Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword;
        next();
    })

const User = mongoose.model('User',userSchema);
module.exports = User