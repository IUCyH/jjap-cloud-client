import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../utils/env';
import { useUser } from '../contexts/UserContext';

// Define the Music interface based on server response
interface Music {
  id: number;
  originalName: string;
  singer: string;
  playTime: number;
}

const MusicList: React.FC = () => {
  const [musics, setMusics] = useState<Music[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string>('');
  const { user } = useUser();
  const navigate = useNavigate();

  // Helper function to format play time from seconds to hours:minutes:seconds
  const formatPlayTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Fetch music data when component mounts or date changes
  useEffect(() => {
    const fetchMusics = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construct URL with optional date parameter
        let url = `${API_URL}/musics`;
        if (date) {
          url += `?date=${date}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin,
          },
          credentials: 'include', // Include cookies (JSESSIONID)
          mode: 'cors', // Enable CORS
        });

        if (!response.ok) {
          throw new Error('Failed to fetch music data');
        }

        const data = await response.json();
        setMusics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching music data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMusics();
  }, [date]);

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

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
              <Link to="/" className="!rounded-button whitespace-nowrap cursor-pointer border-2 border-indigo-600 text-indigo-600 px-6 py-2 font-medium hover:bg-indigo-50 transition duration-300 ease-in-out">
                홈으로
              </Link>
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

      <div className="pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-indigo-600 mb-6">음악 목록</h1>

          {/* Date filter */}
          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              날짜로 필터링 (선택사항)
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {/* Music list */}
              {musics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {musics.map((music) => (
                    <div key={music.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <h3 className="text-lg font-semibold text-indigo-800">{music.originalName}</h3>
                      <p className="text-sm text-indigo-600">가수: {music.singer}</p>
                      <p className="text-xs text-gray-500 mt-1">재생 시간: {formatPlayTime(music.playTime)}</p>
                      <div className="flex justify-between items-center mt-3">
                        <button 
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          재생
                        </button>
                        <span className="text-xs text-gray-400">ID: {music.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">음악 목록이 비어 있습니다.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicList;
