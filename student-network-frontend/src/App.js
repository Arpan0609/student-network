import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Notifications from './components/Notifications';
import Groups from './components/Groups';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/check_auth/', { withCredentials: true })
      .then(res => {
        setLoggedIn(res.data.authenticated);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Router>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Routes>
        <Route path="/login" element={loggedIn ? <Navigate to="/feed" /> : <Login setLoggedIn={setLoggedIn} />} />
        <Route path="/register" element={loggedIn ? <Navigate to="/feed" /> : <Register />} />
        <Route path="/" element={<Navigate to={loggedIn ? "/feed" : "/login"} />} />
        
        {loggedIn ? (
          <>
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/groups" element={<Groups />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;