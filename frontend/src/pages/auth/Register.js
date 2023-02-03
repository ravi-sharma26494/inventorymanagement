import React, { useState } from "react";
import styles from "./auth.module.scss";
import { TiUserAddOutline } from "react-icons/ti";
<<<<<<< HEAD
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
=======
import Card from "../../components/card/Card"
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser, validateEmail } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { SET_LOGIN, SET_NAME } from '../../redux/features/auth/authSlice';

>>>>>>> 3dd7c5d02389bef957116dc442866c5baa1842ab

const initialState = {
  name:'',
  email:'',
  password:'',
  password2:'',
}

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const {name, email, password, password2} = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
<<<<<<< HEAD
=======

>>>>>>> 3dd7c5d02389bef957116dc442866c5baa1842ab
  const handleInputChange  = (e)=>{
    
    const {name, value} = e.target;
    setformData({ ...formData, [name]:value})
  };
<<<<<<< HEAD
  const register  = async (e)=>{
=======
  const register  = async(e) => {
>>>>>>> 3dd7c5d02389bef957116dc442866c5baa1842ab
    e.preventDefault();

    if(!name || !email|| !password ){
      return toast.error("All fields are required")
    }
    if(password.length < 6){
      return toast.error("Password must be upto 6 characters")
    }
<<<<<<< HEAD
    if(!validateEmail(email)){
      return toast.error("Please add a valid email address.")
    }
    if(password != password2 ){
      return toast.error("Passwords donot match!!")
    }
    const userData = {
      name,
      email,
      password,
    };
    setIsLoading(true);
    try {
      const data = await registerUser(userData);
      // console.log(data);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    
=======
    if(password !== password2 ){
      return toast.error("Passwords donot match!!")
    }
    if(!validateEmail(email)){
      return toast.error("Please enter a valid email address");
    }

    const userData = {
      name,email,password
    }
    setIsLoading(true);
    try {
      const data  = await registerUser(userData);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate('/dashboard');
      setIsLoading(false);
      
    } catch (error) {
      setIsLoading(false);
    }

>>>>>>> 3dd7c5d02389bef957116dc442866c5baa1842ab
  };
}

  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className='--flex-center'>
            <TiUserAddOutline size={35} color="#999"/>
          </div>
          <h2>Register</h2>
          <form onSubmit={register}>
          <input
            type={"text"} 
            placeholder="Name" 
            required
            name='name'
            value={name}
            onChange={handleInputChange}
            />
            <input
            type={"email"} 
            placeholder="Email" 
            required
            name='email'
            value={email}
            onChange={handleInputChange}
            />
            <input
            type={"password"} 
            placeholder="Password" 
            required
            name='password'
            value={password}
            onChange={handleInputChange}
            />
            <input
            type={"password"} 
            placeholder="Confirm Password" 
            required
            name='password2'
            value={password2}
            onChange={handleInputChange}
            />
            <button type='submit' className="--btn --btn-primary --btn-block">Register</button>
          </form>
          <span className={styles.register}>
            <Link to={"/"}>Home</Link>
            <p>&nbsp; Already have an account ? &nbsp;</p>
            <Link to={"/login"}>Login</Link>
          </span>
        </div>
      </Card>
    </div>
  )
}

export default Register