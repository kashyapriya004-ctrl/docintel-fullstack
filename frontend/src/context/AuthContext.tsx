import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type User = {
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  guestQueryCount: number;
  incrementGuestQueryCount: () => void;
  resetGuestQueryCount: () => void;
  login: (userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  guestQueryCount: 0,
  incrementGuestQueryCount: () => { },
  resetGuestQueryCount: () => { },
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedAuth = localStorage.getItem('docintel_user');
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  const [guestQueryCount, setGuestQueryCount] = useState<number>(() => {
    const count = localStorage.getItem('docintel_guest_query_count');
    return count ? parseInt(count, 10) : 0;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('docintel_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('docintel_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('docintel_guest_query_count', guestQueryCount.toString());
  }, [guestQueryCount]);

  const incrementGuestQueryCount = () => {
    if (!user) {
      setGuestQueryCount((prev) => prev + 1);
    }
  };

  const resetGuestQueryCount = () => {
    setGuestQueryCount(0);
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.removeItem('docintel_history'); // Clear local guest history
    localStorage.setItem('docintel_user', JSON.stringify(userData));
    // Usually here you'd also save the JWT context but we mock it inside for now based on user's answer.
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      guestQueryCount,
      incrementGuestQueryCount,
      resetGuestQueryCount,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
