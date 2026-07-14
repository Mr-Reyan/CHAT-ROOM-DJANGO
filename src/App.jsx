import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from "./components/ProtectedRoute";
import AllUsers from './pages/AllUsers';
import DirectMessage from './pages/DirectMessage'

function App() {


  return (
    <div className='flex flex-col h-screen'>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/all-users" element={<AllUsers/>} />

        <Route path='/' element={<ProtectedRoute />}> 
          {/* <Route path="/chat" element={<ChatBox />} /> */}
          <Route path="/chat/:conv_id" element={<DirectMessage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App