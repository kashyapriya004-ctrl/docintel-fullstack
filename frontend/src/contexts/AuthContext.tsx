import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

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
    // Try backend first
    try {
      const res = await fetch(`${BACKEND_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      if (res.ok) {
        // Backend worked, create local profile
        const newUser: UserProfile = { id: Date.now().toString(), fullName: data.fullName, email: data.email, role: data.role };
        setUser(newUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        const users = getUsers();
        users.push({ ...newUser, password: data.password });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        sessionStorage.removeItem("docintel-guest-count");
        setGuestQueries(0);
        return { success: true };
      }
    } catch { /* backend not available, fall through to local */ }

    // Fallback to local storage
    const users = getUsers();
    if (users.find((u) => u.email === data.email)) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser: UserProfile = { id: Date.now().toString(), fullName: data.fullName, email: data.email, role: data.role };
    users.push({ ...newUser, password: data.password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    sessionStorage.removeItem("docintel-guest-count");
    setGuestQueries(0);
    return { success: true };
  };

  const login = async (email: string, password: string) => {
    // Try backend first
    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          const users = getUsers();
          const found = users.find((u) => u.email === email);
          const profile: UserProfile = found || { id: "1", fullName: email.split("@")[0], email, role: "User" };
          setUser(profile);
          localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
          sessionStorage.removeItem("docintel-guest-count");
          setGuestQueries(0);
          return { success: true };
        }
      }
    } catch { /* backend not available, fall through to local */ }

    // Fallback to local storage
    const users = getUsers();
    const found = users.find((u) => u.email === email);
    if (!found) return { success: false, error: "No account found. Please create an account first." };
    if (found.password !== password) return { success: false, error: "Invalid email or password." };
    const profile: UserProfile = { id: found.id, fullName: found.fullName, email: found.email, role: found.role };
    setUser(profile);
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    sessionStorage.removeItem("docintel-guest-count");
    setGuestQueries(0);
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
