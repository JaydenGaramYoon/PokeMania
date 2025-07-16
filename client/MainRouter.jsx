import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './src/components/Home/Home';
import Layout from './src/components/Layout/Layout';
import Favourites from './src/components/Favourites/Favourites';
import Talktalk from './src/components/Talktalk/Talktalk';
import Game from './src/components/Game/Game';
import Login from './src/components/Login/Login';
import Profile from './src/components/Profile/Profile';

const MainRouter = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const isLoggedIn = !!token;
  const isLoginPage = location.pathname === '/';

  // 🧠 Only show Login page if not logged in
  if (!isLoggedIn && isLoginPage) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    );
  }

  // 🔓 After login, show full app
  return (
    <div>
      <Layout />
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/talktalk" element={<Talktalk />} />
          <Route path="/game" element={<Game />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

export default MainRouter;
