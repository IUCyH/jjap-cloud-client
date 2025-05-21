import React, { createContext, useState, useContext, ReactNode } from 'react';
import { API_URL } from '../utils/env';

// Define the user interface
interface User {
  id: number;
  nickname: string;
  email: string;
}

// Define the context interface
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  error: null,
  fetchUser: async () => {},
  logout: () => {},
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user data
  const fetchUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies (JSESSIONID)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to logout
  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, error, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;