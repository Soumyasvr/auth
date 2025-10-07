import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContent'

const Header = () => {

  const {userData} = useContext(AppContent)

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center gap-4 text-center text-gray-800'>
        <img src={assets.header_img} alt="" className='h-36 w-36 rounded-full mb-6' />
        <h1 className='text-2xl font-bold flex gap-2'>Hey {userData ? userData.name : "Developer"}! <img src={assets.hand_wave} alt="" className='w-6 aspect-square'/></h1>
        <h2 className='text-xl font-semibold'>Welcome to our platform</h2>
        <p className=''>We're glad to have you here. Explore our features and enjoy your stay!</p>
        <button className='border border-gray-500 px-4 py-2 cursor-pointer rounded-full hover:bg-gray-100 transition-all duration-200'>
            Get Started
        </button>
    </div>
  )
}

export default Header