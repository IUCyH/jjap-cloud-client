import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { uploadMusic } from '../utils/api';
import { format } from 'date-fns';

const MusicUpload: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [singer, setSinger] = useState<string>('');
  const [createTime, setCreateTime] = useState<string>(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { user } = useUser();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name || !singer || !createTime || !musicFile) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('name', name);
      formData.append('singer', singer);
      formData.append('createTime', createTime);
      formData.append('musicFile', musicFile);

      // Use the uploadMusic function from the API utility
      await uploadMusic(formData);

      // Success
      setSuccess(true);
      // Reset form
      setName('');
      setSinger('');
      setCreateTime(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
      setMusicFile(null);

      // Redirect to music list after 2 seconds
      setTimeout(() => {
        navigate('/musics');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      console.error('Error uploading music:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMusicFile(e.target.files[0]);
    }
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
              <Link to="/musics" className="!rounded-button whitespace-nowrap cursor-pointer bg-indigo-600 text-white px-6 py-2 font-medium hover:bg-indigo-700 transition duration-300 ease-in-out">
                음악 탐색
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
          <h1 className="text-3xl font-bold text-indigo-600 mb-6">음악 업로드</h1>

          {/* Success message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">음악이 성공적으로 업로드되었습니다. 음악 목록 페이지로 이동합니다...</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                음악 이름
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="음악 이름을 입력하세요"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="singer" className="block text-sm font-medium text-gray-700 mb-2">
                가수
              </label>
              <input
                type="text"
                id="singer"
                value={singer}
                onChange={(e) => setSinger(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="가수 이름을 입력하세요"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="createTime" className="block text-sm font-medium text-gray-700 mb-2">
                생성 시간
              </label>
              <input
                type="text"
                id="createTime"
                value={createTime}
                onChange={(e) => setCreateTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="YYYY-MM-DD HH:MM:SS"
                disabled={loading}
              />
              <p className="mt-1 text-sm text-gray-500">형식: YYYY-MM-DD HH:MM:SS</p>
            </div>

            <div>
              <label htmlFor="musicFile" className="block text-sm font-medium text-gray-700 mb-2">
                음악 파일
              </label>
              <input
                type="file"
                id="musicFile"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                accept="audio/*"
                disabled={loading}
              />
              {musicFile && (
                <p className="mt-2 text-sm text-gray-500">
                  선택된 파일: {musicFile.name}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    업로드 중...
                  </div>
                ) : (
                  '음악 업로드'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MusicUpload;
