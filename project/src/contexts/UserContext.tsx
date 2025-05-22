import React, { createContext, useState, useContext, ReactNode } from 'react';
import { fetchCurrentUser } from '../utils/api';
import { clearCsrfToken } from '../utils/csrf';

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
  fetchUser: () => Promise.resolve(),
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
      const data = await fetchCurrentUser();
      setUser(data as User);
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
    clearCsrfToken(); // Clear the CSRF token on logout
  };

  return (
    <UserContext.Provider value={{ user, loading, error, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
