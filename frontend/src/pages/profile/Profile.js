import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser';
import { SET_NAME, SET_USER } from '../../redux/features/auth/authSlice';
import { getUser } from '../../services/authService';
import "./Profile.scss";


const Profile = () => {
  useRedirectLoggedOutUser("/login");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setIsLoading(true);
    async function getUserData(){
      const data = await getUser();
      console.log(data);

      setProfile(data);
      setIsLoading(false);
      await dispatch(SET_USER(data));
      await dispatch(SET_NAME(data.name));
    }
    getUserData();
  }, [dispatch]);
  

  return (
    <div>

    </div>
  )
}

export default Profile