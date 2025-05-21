import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Home: React.FC = () => {
  const { user, loading, error } = useUser();

  // We don't need to fetch user data on component mount
  // User data is fetched when the login button is pressed in the Login component

  return (
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

              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 shadow-sm border border-indigo-100">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {user.nickname.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-indigo-800">
                        안녕하세요, {user.nickname}님!
                      </p>
                      <p className="text-xs text-indigo-600">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="!rounded-button whitespace-nowrap cursor-pointer border-2 border-red-600 text-red-600 px-6 py-2 font-medium hover:bg-red-50 transition duration-300 ease-in-out"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="!rounded-button whitespace-nowrap cursor-pointer border-2 border-indigo-600 text-indigo-600 px-6 py-2 font-medium hover:bg-indigo-50 transition duration-300 ease-in-out mr-2">
                    로그인
                  </Link>
                  <Link to="/register" className="!rounded-button whitespace-nowrap cursor-pointer border-2 border-purple-600 text-purple-600 px-6 py-2 font-medium hover:bg-purple-50 transition duration-300 ease-in-out">
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
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
              {user && (
                <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg border border-indigo-100 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mr-4">
                      {user.nickname.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-indigo-800">사용자 정보</h2>
                      <p className="text-indigo-600 text-sm">Welcome back to JJAP Cloud!</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    <div className="flex items-center bg-white bg-opacity-70 p-3 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">ID</p>
                        <p className="font-medium text-gray-800">{user.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-white bg-opacity-70 p-3 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">닉네임</p>
                        <p className="font-medium text-gray-800">{user.nickname}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-white bg-opacity-70 p-3 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">이메일</p>
                        <p className="font-medium text-gray-800">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
  );
};

export default Home;
