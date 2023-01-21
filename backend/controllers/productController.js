const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

const createProduct = asyncHandler (async (req,res)=>{
    const {name, sku, category, quantity, price, description} = req.body;

    //Validation
    if(!name || !category || !quantity || !price || !description){
        res.status(400);
        throw new Error("Please add all the fields");
    }

    //Handle Image upload
    let fileData = {};
      
    //create product
    const product = await Product.create({
        user: req.user.id,
        name,
        sku,
        category,
        quantity,
        price,
        description
    });

    res.status(201).json(product);

});

module.exports = {
    createProduct,
};