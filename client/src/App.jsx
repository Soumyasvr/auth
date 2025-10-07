import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import VerifyAccount from './pages/VerifyAccount'

import { ToastContainer} from 'react-toastify';
import { AppProvider } from './context/AppContent'

const App = () => {
  return (
    <div>
      
        <BrowserRouter>
        

      
          <ToastContainer position='top-center' autoClose={2000} theme='dark'/>
          <AppProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
        </Routes>
        </AppProvider>
        </BrowserRouter>
          
          {/*  */}
        
      
    </div>
  )
}

export default App