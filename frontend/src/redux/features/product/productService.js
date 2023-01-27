import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api/products`

//create New Product
const createProduct = async (formData)=>{
    const response = axios.post(API_URL, formData);
    return response.data
};

//Get All Product
const getProducts = async ()=>{
    const response = axios.get(API_URL);
    return response.data;
};

const productService = {
    createProduct,
    getProducts
}

export default productService;