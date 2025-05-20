// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  {/* Logo */}
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">JJAP Cloud</h1>
                  </div>
                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center space-x-8">
                    <button className="!rounded-button whitespace-nowrap cursor-pointer bg-indigo-600 text-white px-6 py-2 font-medium hover:bg-indigo-700 transition duration-300 ease-in-out">
                      음악 탐색
                    </button>
                    <button className="!rounded-button whitespace-nowrap cursor-pointer bg-purple-600 text-white px-6 py-2 font-medium hover:bg-purple-700 transition duration-300 ease-in-out">
                      음악 업로드
                    </button>
                    <Link to="/login" className="!rounded-button whitespace-nowrap cursor-pointer border-2 border-indigo-600 text-indigo-600 px-6 py-2 font-medium hover:bg-indigo-50 transition duration-300 ease-in-out mr-2">
                      로그인
                    </Link>
                    <Link to="/register" className="!rounded-button whitespace-nowrap cursor-pointer border-2 border-purple-600 text-purple-600 px-6 py-2 font-medium hover:bg-purple-50 transition duration-300 ease-in-out">
                      회원가입
                    </Link>
                  </div>
                  {/* Mobile menu button */}
                  <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="!rounded-button whitespace-nowrap cursor-pointer inline-flex items-center justify-center p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
                    >
                      <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                    </button>
                  </div>
                </div>
              </div>
              {/* Mobile Navigation */}
              {isMenuOpen && (
                  <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3 flex flex-col items-center">
                      <button className="!rounded-button whitespace-nowrap cursor-pointer w-full bg-indigo-600 text-white px-6 py-2 font-medium hover:bg-indigo-700 transition duration-300 ease-in-out">
                        음악 탐색
                      </button>
                      <button className="!rounded-button whitespace-nowrap cursor-pointer w-full bg-purple-600 text-white px-6 py-2 font-medium hover:bg-purple-700 transition duration-300 ease-in-out">
                        음악 업로드
                      </button>
                      <Link to="/login" className="!rounded-button whitespace-nowrap cursor-pointer w-full border-2 border-indigo-600 text-indigo-600 px-6 py-2 font-medium hover:bg-indigo-50 transition duration-300 ease-in-out">
                        로그인
                      </Link>
                      <Link to="/register" className="!rounded-button whitespace-nowrap cursor-pointer w-full border-2 border-purple-600 text-purple-600 px-6 py-2 font-medium hover:bg-purple-50 transition duration-300 ease-in-out">
                        회원가입
                      </Link>
                    </div>
                  </div>
              )}
            </nav>
            {/* Hero Section */}
            <div className="pt-16 relative overflow-hidden">
              <div className="absolute inset-0 z-0 bg-cover bg-center" style={{
                backgroundImage: `url('https://readdy.ai/api/search-image?query=abstract%20sound%20waves%20visualization%20with%20purple%20and%20blue%20gradient%20colors%20flowing%20across%20a%20clean%20minimalist%20background%2C%20modern%20digital%20audio%20concept%20with%20smooth%20curves%20and%20dynamic%20patterns&width=1440&height=800&seq=hero-bg-1&orientation=landscape')`,
                backgroundBlendMode: 'soft-light',
                opacity: 0.8
              }}></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                      공짜 <span className="text-indigo-600">음악 스트리밍</span>
                    </h1>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                      <button className="!rounded-button whitespace-nowrap cursor-pointer bg-indigo-600 text-white px-8 py-3 text-lg font-medium hover:bg-indigo-700 transition duration-300 ease-in-out">
                        좋아하는 음악을 찾아보세요!
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                        src="https://readdy.ai/api/search-image?query=modern%20audio%20waveform%20visualization%20device%20with%20headphones%20on%20a%20minimalist%20desk%20setup%2C%20clean%20professional%20audio%20workspace%20with%20subtle%20blue%20and%20purple%20lighting%20accents&width=600&height=600&seq=hero-img-1&orientation=squarish"
                        alt="Audio visualization"
                        className="rounded-lg shadow-xl w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Call to Action */}
            <div className="py-20 bg-indigo-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">음악 여정을 시작해볼까요?</h2>
                <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
                  수많은 음악들을 탐색해보세요
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="!rounded-button whitespace-nowrap cursor-pointer bg-transparent border-2 border-white text-white px-8 py-3 text-lg font-medium hover:bg-white hover:bg-opacity-10 transition duration-300 ease-in-out">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">JJAP cloud</h3>
                    <p className="text-gray-400">
                      The ultimate platform for discovering, sharing, and enjoying music.
                    </p>
                    <div className="mt-4 flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                        <i className="fab fa-youtube"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                  <p>© 2025 JJAP cloud. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
