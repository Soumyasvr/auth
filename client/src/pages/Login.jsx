import React, { useContext, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContent } from '../context/AppContent'

const Login = () => {

  const {backendURL,setIsLoggedIn, getUserData} = useContext(AppContent)



  const [state, setState] = useState("Sign up")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const onSubmitHandeler = async (e) => {
   try {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    if(state === "Sign up"){

      const {data} = await axios.post(backendURL + "/api/auth/register", {name, email,password})
      

      if(data.success){
        setIsLoggedIn(true),
        getUserData(),
        navigate("/")
      }else{
          toast.error(data.message)
      }
    }else{
      const {data} = await axios.post(backendURL + "/api/auth/login",{email,password})

      if(data.success){
        setIsLoggedIn(true),
        getUserData(),
        navigate("/")
      }else{
          toast.error(data.message)
      }
    }
   } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong. Please try again!");
   }
    
  }

  return (
    <div className='w-full h-screen flex justify-center items-center p-6 sm:h-screen 
    bg-gradient-to-tr from-blue-200 via-purple-400'>
      <img onClick = {()=> navigate("/")} src={assets.logo} alt="" className='absolute left-5 top-5 sm:left-6 w-24 sm:w-32 cursor-pointer '/>
      <div className='flex flex-col bg-slate-900 p-10 rounded-lg shadow-lg w-full text-indigo-300 sm:w-96'>
        <h1 className='text-white text-3xl font-semibold text-center mb-3'>{state === "Sign up" ? "Create an Account" : "Login"}</h1>
        <p className='text-center text-sm mb-6'>{state === "Sign up" ? "Create your account" : "Login to your account"}</p>
        <form onSubmit={onSubmitHandeler}>
          {state === "Sign up" && (<div className='flex items-center gap-3 border w-full px-5 py-2.5 rounded-full bg-[#333A5C] mb-4 border-0'>
          <img src={assets.person_icon} alt=""/>
          <input 
          onChange={e=> setName(e.target.value)}
          value={name}
          className='bg-transparent outline-none text-white' 
          type="text" 
          placeholder='Full Name' 
          required/>
        </div>
)}
        
        <div className='flex items-center gap-3 border w-full px-5 py-2.5 rounded-full bg-[#333A5C] mb-4 border-0'>
          <img src={assets.mail_icon} alt=""/>
          <input
          onChange={e=> setEmail(e.target.value)}
          value={email}
          className='bg-transparent outline-none text-white' 
          type="email" 
          placeholder='Email Address' 
          required/>
        </div>

        <div className='flex items-center gap-3 border w-full px-5 py-2.5 rounded-full bg-[#333A5C] mb-4 border-0'>
          <img src={assets.lock_icon} alt=""/>
          <input 
          onChange={e=> setPassword(e.target.value)}
          value={password}
          className='bg-transparent outline-none text-white' 
          type="password" 
          placeholder='Password' 
          required/>
        </div>
        <p onClick = {()=> navigate("/reset-password")} className='text-indigo-500 cursor-pointer mb-4'>Forget password?</p>
        <button className='w-full bg-indigo-600 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-2.5 rounded-full
        mb-4 cursor-pointer font-medium' 
        type='submit'> {state}</button>

        {state === "Sign up" ? (<p className='text-center text-sm text-gray-400 mb-4'>Already have an account? 
          <span className='text-blue-500 cursor-pointer underline' onClick={() => setState("Login")}>
            {' '}Login here</span></p>) 
            : 
            (<p className='text-center text-sm text-gray-400 mb-4'>Don't have an account? 
          <span className='text-blue-500 cursor-pointer underline' onClick={() => setState("Sign up")}>
            {' '}Sign up</span></p>)}

        

        

      </form>
      </div>
      
    </div>
  )
}

export default Login