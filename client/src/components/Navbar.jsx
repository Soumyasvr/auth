import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContent';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  
    const navigate = useNavigate();
    const {userData, backendURL, setUserData, setIsLoggedIn} = useContext(AppContent)

    const sendVerificationOTP = async () => {
      try {
        axios.defaults.withCredentials = true;
        const {data} = await axios.post(backendURL + "/api/auth/send-otp");
        if(data.success){
          navigate("/verify-account")
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error.message)
      }
    }

    const logout = async () => {
        try {
          axios.defaults.withCredentials = true;
          const { data } = await axios.post(backendURL + "/api/auth/logout");
          if (data.success) {
            setIsLoggedIn(false);
            setUserData(false);
            navigate("/");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || error.message);
  }
};
return(
    <div className='w-full flex justify-between items-center p-6 sm:p-6 sm:px-24 absolute top-0 left-0 z-10'>
        <img src={assets.logo} alt="Logo"  className='w-32 sm:w-32'/>
        {userData ? 
          <div className='h-10 w-10 rounded-full bg-gray-200 text-gray-800 flex justify-center items-center font-bold text-lg relative cursor-pointer group'>
            {userData.name[0].toUpperCase()}
              <div className='absolute top-0 right-0  rounded p-4 hidden group-hover:block z-10 pt-12'>
                <ul className='text-sm bg-gray-100 list-none m-0 p-2 w-35'>
                  {!userData.isAccountVerified && <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer' onClick={sendVerificationOTP}>Verify account</li>}
                  <li className='py-1 px-2 pr-20 hover:bg-gray-200 cursor-pointer' onClick={logout}>Logout</li>
                </ul>
              </div>
          </div> :
          <button className="flex justify-center gap-2 items-center border border-gray-500 px-6 py-2 rounded-full cursor-pointer
          hover:bg-gray-100 transition-all duration-200
          "
          onClick={() => navigate('/login')} 
          >Login <img src={assets.arrow_icon} alt="" /></button>
          }
         
    </div>
  )
}

export default Navbar