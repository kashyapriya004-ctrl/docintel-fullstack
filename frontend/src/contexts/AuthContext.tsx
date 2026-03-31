import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  guestQueries: number;
  canQuery: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { fullName: string; email: string; password: string; role: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  incrementGuestQuery: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const GUEST_LIMIT = 3;
const USERS_KEY = "docintel-users";
const SESSION_KEY = "docintel-session";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [guestQueries, setGuestQueries] = useState(0);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch { /* ignore */ }
    }
    const count = parseInt(sessionStorage.getItem("docintel-guest-count") || "0", 10);
    setGuestQueries(count);
  }, []);

  const isAuthenticated = !!user;
  const canQuery = isAuthenticated || guestQueries < GUEST_LIMIT;

  const getUsers = (): (UserProfile & { password: string })[] => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const signup = async (data: { fullName: string; email: string; password: string; role: string }) => {
    const users = getUsers();
    if (users.find((u) => u.email === data.email)) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser = { id: Date.now().toString(), fullName: data.fullName, email: data.email, role: data.role, password: data.password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const profile: UserProfile = { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role };
    setUser(profile);
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    // Clear guest queries on login
    sessionStorage.removeItem("docintel-guest-count");
    setGuestQueries(0);
    return { success: true };
  };

  const login = async (email: string, password: string) => {
    const users = getUsers();
    const found = users.find((u) => u.email === email);
    if (!found) return { success: false, error: "No account found. Please create an account first." };
    if (found.password !== password) return { success: false, error: "Invalid email or password." };
    const profile: UserProfile = { id: found.id, fullName: found.fullName, email: found.email, role: found.role };
    setUser(profile);
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    sessionStorage.removeItem("docintel-guest-count");
    setGuestQueries(0);
    // Clear guest history
    localStorage.removeItem("docintel-history");
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const incrementGuestQuery = () => {
    const newCount = guestQueries + 1;
    setGuestQueries(newCount);
    sessionStorage.setItem("docintel-guest-count", newCount.toString());
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, guestQueries, canQuery, login, signup, logout, incrementGuestQuery }}>
      {children}
    </AuthContext.Provider>
  );
};
