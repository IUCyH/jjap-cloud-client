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
      const audioUrl = `${API_URL}/musics/${id}`;

      // Set up error handling first to catch any errors during setup
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        const errorMessage = audioRef.current?.error ? 
          `Error code: ${audioRef.current.error.code}, message: ${audioRef.current.error.message}` : 
          'Unknown error';
        console.error('Detailed error:', errorMessage);
        setError('Failed to play the audio. Please try again.');
      });

      // Add event listeners for debugging
      audioRef.current.addEventListener('loadstart', () => {
        console.log('Audio loading started');
      });

      audioRef.current.addEventListener('canplay', () => {
        console.log('Audio can play now');
      });

      // Log when seeking occurs to verify Range requests
      audioRef.current.addEventListener('seeking', () => {
        console.log('Audio seeking - browser will send Range header');
      });

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
              const response = await fetch(`${API_URL}/musics/${id}`, {
                method: 'GET',
                headers: {
                  'Range': `bytes=${start}-${end}`,
                  'Origin': window.location.origin,
                  // Specify multiple audio formats in Accept header for better compatibility
                  'Accept': 'audio/mpeg, audio/mp4, audio/aac, audio/ogg, audio/*, */*',
                },
                credentials: 'include',
                mode: 'cors',
              });

              if (!response.ok) {
                throw new Error(`Failed to fetch audio chunk: ${response.status} ${response.statusText}`);
              }

              // Log content type for debugging
              const contentType = response.headers.get('Content-Type');
              console.log(`Server returned Content-Type: ${contentType}`);

              return await response.arrayBuffer();
            } catch (error) {
              console.error('Error fetching audio chunk:', error);
              throw error;
            }
          };

          // Try direct URL first as it's the most reliable method
          try {
            console.log('Trying direct URL first...');
            // Add audio type parameter to help the browser identify the content
            const audioUrlWithType = `${audioUrl}?type=audio/mpeg`;
            audioRef.current!.src = audioUrlWithType;

            // Return early to avoid further processing
            return;
          } catch (directUrlError) {
            console.error('Direct URL approach failed:', directUrlError);
            // Continue with chunk-based approaches
          }

          // For initial metadata, fetch the first chunk
          try {
            // Fetch the first 128KB to get metadata
            const initialChunk = await fetchAudioChunk(0, 131071);
            // Try multiple MIME types to increase compatibility
            // Use a more specific MIME type for better browser compatibility
            const blob = new Blob([initialChunk], { 
              type: 'audio/mpeg' // MP3 is widely supported
            });
            const blobUrl = URL.createObjectURL(blob);

            // Set the audio source to the blob URL
            audioRef.current!.src = blobUrl; // Use the blob URL created from the fetched chunk

            console.log('Initial audio chunk loaded');
          } catch (chunkError) {
            console.error('Error loading initial audio chunk:', chunkError);
            // Try a different approach - fetch a smaller chunk
            try {
              console.log('Retrying with a smaller chunk size...');
              const smallerChunk = await fetchAudioChunk(0, 65535); // Try with 64KB
              // Try with alternative MIME types
              const mimeTypes = ['audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/*'];
              let success = false;

              // Try each MIME type until one works
              for (const mimeType of mimeTypes) {
                if (success) break;
                try {
                  const retryBlob = new Blob([smallerChunk], { type: mimeType });
                  const retryBlobUrl = URL.createObjectURL(retryBlob);
                  audioRef.current!.src = retryBlobUrl;
                  console.log(`Retry successful with MIME type: ${mimeType}`);
                  success = true;
                } catch (mimeError) {
                  console.error(`Failed with MIME type ${mimeType}:`, mimeError);
                }
              }

              if (!success) {
                throw new Error('All MIME types failed');
              }
            } catch (retryError) {
              console.error('Retry failed:', retryError);
              setError('Failed to load audio. Please try again later.');
              // As a last resort, try the direct URL again with type parameter
              audioRef.current!.src = `${audioUrl}?type=audio/mpeg`;
            }
          }
        } catch (err) {
          console.error('Error setting up audio stream:', err);

          // Try one more approach with a very small chunk as a last resort
          try {
            console.log('Attempting last resort approach with minimal chunk...');
            // Try to detect the content type first
            const headResponse = await fetch(`${API_URL}/musics/${id}`, {
              method: 'HEAD',
              headers: {
                'Origin': window.location.origin,
              },
              credentials: 'include',
              mode: 'cors',
            });

            // Get content type from server if available
            const serverContentType = headResponse.headers.get('Content-Type');
            console.log(`Server content type from HEAD request: ${serverContentType}`);

            // Fetch a minimal chunk
            const response = await fetch(`${API_URL}/musics/${id}`, {
              method: 'GET',
              headers: {
                'Range': 'bytes=0-16383', // Just 16KB
                'Origin': window.location.origin,
                'Accept': 'audio/mpeg, audio/mp4, audio/aac, audio/ogg, audio/*, */*',
              },
              credentials: 'include',
              mode: 'cors',
            });

            if (response.ok) {
              const minimalChunk = await response.arrayBuffer();
              const responseContentType = response.headers.get('Content-Type');
              console.log(`Content-Type from GET response: ${responseContentType}`);

              // Determine the best MIME type to use
              let bestMimeType = 'audio/mpeg'; // Default to MP3

              // Use server-provided content type if available and it's an audio type
              if (serverContentType && serverContentType.includes('audio/')) {
                bestMimeType = serverContentType;
              } else if (responseContentType && responseContentType.includes('audio/')) {
                bestMimeType = responseContentType;
              }

              console.log(`Using MIME type: ${bestMimeType}`);

              // Try with the determined MIME type
              const lastResortBlob = new Blob([minimalChunk], { type: bestMimeType });
              const lastResortUrl = URL.createObjectURL(lastResortBlob);
              audioRef.current!.src = lastResortUrl;
              console.log('Last resort approach successful');
            } else {
              throw new Error(`Last resort fetch failed: ${response.status} ${response.statusText}`);
            }
          } catch (lastError) {
            console.error('All approaches failed:', lastError);
            setError('Failed to set up audio stream. Please try again later.');

            // Only as an absolute last resort, try the direct URL with type parameter
            audioRef.current!.src = `${audioUrl}?type=audio/mpeg`;

            // Add event listener to detect if this final attempt fails
            audioRef.current!.addEventListener('error', () => {
              console.error('Final direct URL attempt failed');
              setError('Unable to play this audio file. The format may not be supported by your browser.');
            });
          }
        }
      };

      customAudioSource();
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
                      preload="auto"
                      crossOrigin="anonymous"
                      autoPlay={false}
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
