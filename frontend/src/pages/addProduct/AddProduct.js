import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import ProductForm from '../../components/product/productForm/ProductForm';
import { createProduct, selectIsloading } from '../../redux/features/product/productSlice';

const initialState = {
    name:"",
    category:"",
    quantity:"",
    price:"",
};

const AddProduct = () => {
  const dispatch = useDispatch();
  const naviagte = useNavigate();

  const [product, setProduct] = useState(initialState);
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");

  const isLoading = useSelector(selectIsloading);

  const {name, category, quantity, price} = product;
  
  const handleInputChange  = (e)=>{
    const {name, value} = e.target;
    setProduct({ ...product, [name]: value});
  };
 
  const handleImageChange  = (e)=>{
    setProductImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const generateSKU = (category)=>{
    const letter  = category.slice(0,3).toUpperCase();
    const number = Date.now();
    const sku = letter + "-" + number;
    return sku;
  };

  const saveProduct = async (e)=>{
    e.preventDefault();
    const formData =  new FormData();
    formData.append("name", name);
    formData.append("sku", generateSKU(category));
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", productImage);

    console.log(...formData);
    await dispatch(createProduct(formData));

    naviagte("/dashboard");
  }
  return (
    <div>
      {isLoading && <Loader />}
        <h3 className='--mt'>Add New Product</h3>
        <ProductForm
            product={product}
            productImage={productImage}
            imagePreview={imagePreview}
            description={description}
            setDescription={setDescription}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            saveProduct={saveProduct}
        />
    </div>
  )
}

export default AddProduct