const registerUser =  (req, res)=>{
    if(!req.body.email){
        res.status(400)
        throw new Error("Please add an email")
    }
    res.send('register the user');
}

module.exports = {
    registerUser
}