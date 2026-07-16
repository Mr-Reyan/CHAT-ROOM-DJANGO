import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from "./components/ProtectedRoute";
import AllUsers from './pages/AllUsers';
import DirectMessage from './pages/DirectMessage'
import ForgetPass from './pages/ForgetPassword/ForgetPass';
import PassResetSent from './pages/ForgetPassword/PassResetSent';
import PassResetDone from './pages/ForgetPassword/PassResetDone';
import PassResetConfirm from './pages/ForgetPassword/PassResetConfirm';
import Home from './pages/Home';
import Footer from './components/Footer';
import About from './pages/About';
import Groups from './pages/Groups';
import MyChats from './pages/MyChats';

function App() {


  return (
    <div className='flex flex-col h-screen'>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/about' element={<About />}/>

        <Route path="/forget-password" element={<ForgetPass />} />
        <Route path="/password-reset-sent" element={<PassResetSent />} />
        <Route path="/password-reset-done" element={<PassResetDone />} />
        <Route path="/reset-password/:uid/:token" element={<PassResetConfirm />} />



        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path='/' element={<ProtectedRoute />}> 
        <Route path="/all-users" element={<AllUsers/>} />
        <Route path="/my-chats" element={<MyChats/>} />
        <Route path="/group-chats" element={<Groups/>} />
          <Route path="/chat/:conv_id" element={<DirectMessage />} />
        </Route>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App