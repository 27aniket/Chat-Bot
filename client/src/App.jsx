import { useState } from 'react'
import './index.css'
import { BrowserRouter, Route , Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Verify from './pages/Verify'
import { UserData } from './context/userContext'
import { LoadingBig } from './components/loading'

function App() {

  const {user , isAuth , loading} = UserData()


  return (
    <>
    {loading ? (
      <LoadingBig />
    ) : (
      <BrowserRouter>
        <Routes>
          {/* Home route */}
          <Route path="/" element={isAuth ? <Home /> : <Login />} />

          {/* Login route */}
          <Route path="/login" element={isAuth ? <Home /> : <Login />} />

          {/* Verify route */}
          <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
        </Routes>
      </BrowserRouter>
    )}
    </>
  );
}

export default App
