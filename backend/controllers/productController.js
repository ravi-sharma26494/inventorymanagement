const asyncHandler = require('express-async-handler');

const createProduct = asyncHandler (async (req,res)=>{
    res.send("product created")
});

module.exports = {
    createProduct,
};