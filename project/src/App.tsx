// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import { UserProvider } from './contexts/UserContext';
import Home from './components/Home';
import MusicList from './components/MusicList';
import MusicUpload from './components/MusicUpload';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/musics" element={<MusicList />} />
          <Route path="/upload-music" element={<MusicUpload />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
