import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_URL } from '../utils/env';

interface MusicDetails {
  id: number;
  originalName: string;
  singer: string;
  playTime: number;
}

const MusicPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [music, setMusic] = useState<MusicDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch music details
  useEffect(() => {
    const fetchMusicDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/musics/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin,
          },
          credentials: 'include',
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch music details');
        }

        const data = await response.json();
        setMusic(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching music details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMusicDetails();
    }
  }, [id]);

  // Format play time from seconds to hours:minutes:seconds
  const formatPlayTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Custom audio player with Range header support
  const setupAudioPlayer = () => {
    if (audioRef.current && id) {
      // Create MediaSource URL for streaming
      const audioUrl = `${API_URL}/music/stream/${id}`;

      // Modern browsers automatically handle range requests for audio elements,
      // but we'll implement a custom solution to ensure the Range header is properly sent

      // Create a custom audio source with explicit Range header support
      const customAudioSource = async () => {
        try {
          // Instead of setting the src directly, we'll create a custom fetch with Range headers
          // and create a blob URL for the audio element

          // Function to fetch audio chunks with Range header
          const fetchAudioChunk = async (start: number, end: number) => {
            try {
              const response = await fetch(`${API_URL}/music/stream/${id}`, {
                method: 'GET',
                headers: {
                  'Range': `bytes=${start}-${end}`,
                  'Origin': window.location.origin,
                },
                credentials: 'include',
                mode: 'cors',
              });

              if (!response.ok) {
                throw new Error(`Failed to fetch audio chunk: ${response.status} ${response.statusText}`);
              }

              return await response.arrayBuffer();
            } catch (error) {
              console.error('Error fetching audio chunk:', error);
              throw error;
            }
          };

          // For initial metadata, fetch the first chunk
          try {
            // Fetch the first 128KB to get metadata
            const initialChunk = await fetchAudioChunk(0, 131071);
            const blob = new Blob([initialChunk], { type: 'audio/mpeg' });
            const blobUrl = URL.createObjectURL(blob);

            // Set the audio source to the blob URL
            audioRef.current!.src = audioUrl; // Fall back to direct URL which will use browser's native Range handling

            console.log('Initial audio chunk loaded');
          } catch (chunkError) {
            console.error('Error loading initial audio chunk:', chunkError);
            // Fall back to direct URL which will use browser's native Range handling
            audioRef.current!.src = audioUrl;
          }

          // Add event listeners for debugging and error handling
          audioRef.current!.addEventListener('loadstart', () => {
            console.log('Audio loading started');
          });

          audioRef.current!.addEventListener('canplay', () => {
            console.log('Audio can play now');
          });

          // Log when seeking occurs to verify Range requests
          audioRef.current!.addEventListener('seeking', () => {
            console.log('Audio seeking - browser will send Range header');
          });
        } catch (err) {
          console.error('Error setting up audio stream:', err);
          setError('Failed to set up audio stream. Please try again.');

          // Fall back to direct URL as a last resort
          audioRef.current!.src = audioUrl;
        }
      };

      customAudioSource();

      // Handle errors
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setError('Failed to play the audio. Please try again.');
      });
    }
  };

  // Set up audio player when music details are loaded
  useEffect(() => {
    if (music && !loading) {
      setupAudioPlayer();
    }
  }, [music, loading]);

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
              <Link to="/musics" className="!rounded-button whitespace-nowrap cursor-pointer border-2 border-indigo-600 text-indigo-600 px-6 py-2 font-medium hover:bg-indigo-50 transition duration-300 ease-in-out">
                음악 목록
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-indigo-600 mb-6">음악 플레이어</h1>

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
              {music ? (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 shadow-md">
                  <h2 className="text-2xl font-semibold text-indigo-800 mb-2">{music.originalName}</h2>
                  <p className="text-lg text-indigo-600 mb-4">가수: {music.singer}</p>
                  <p className="text-sm text-gray-500 mb-6">재생 시간: {formatPlayTime(music.playTime)}</p>

                  {/* Audio Player */}
                  <div className="w-full bg-white rounded-lg p-4 shadow-inner">
                    <audio 
                      ref={audioRef}
                      controls 
                      className="w-full" 
                      preload="metadata"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">음악을 찾을 수 없습니다.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
