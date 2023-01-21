const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const { fileSizeFormatter } = require('../utils/fileUpload');
const cloudinary = require('cloudinary').v2;

const createProduct = asyncHandler (async (req,res)=>{
    const {name, sku, category, quantity, price, description} = req.body;

    //Validation
    if(!name || !category || !quantity || !price || !description){
        res.status(400);
        throw new Error("Please add all the fields");
    }

    //Handle Image upload
    let fileData = {};
    if(req.file){
        //saving the image in cloudinary
        let uploadedFile;
        try {
            uploadedFile =  await cloudinary.uploader.upload(req.file.path, {folder: "Pinvent App", resource_type: "image"})
        } catch (error) {
            res.status(500);
            throw new Error("Image could not be upload, please try again");
        }
        fileData = {
            fileName: req.file.originalname,
            // filePath: req.file.path,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }
      
    //create product
    const product = await Product.create({
        user: req.user.id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image: fileData
    });

    res.status(201).json(product);

});

module.exports = {
    createProduct,
};