import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  institution: string;
  is_verified: boolean;
};

type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  guestQueries: number;
  canQuery: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { fullName: string; email: string; password: string; role: string; institution: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  incrementGuestQuery: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const GUEST_LIMIT = 3;
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

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.access_token && data.user) {
          const profile: UserProfile = {
            id: data.user.id.toString(),
            fullName: data.user.full_name || email.split("@")[0],
            email: data.user.email,
            role: data.user.role || "Student",
            institution: data.user.institution || "",
            is_verified: data.user.is_verified || false
          };
          setUser(profile);
          localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
          sessionStorage.removeItem("docintel-guest-count");
          setGuestQueries(0);
          return { success: true };
        }
      }
      const errorData = await res.json();
      return { success: false, error: errorData.error || "Login failed" };
    } catch (e) {
      return { success: false, error: "Cannot connect to server" };
    }
  };

  const signup = async (data: { fullName: string; email: string; password: string; role: string; institution: string }) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          full_name: data.fullName,
          role: data.role,
          institution: data.institution
        }),
      });
      
      if (res.ok) {
        return login(data.email, data.password);
      } else {
        const errorData = await res.json();
        return { success: false, error: errorData.detail || "Registration failed" };
      }
    } catch (e) {
      return { success: false, error: "Cannot connect to server" };
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { success: false, error: "Not logged in" };
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.fullName,
          role: data.role,
          institution: data.institution
        }),
      });
      
      if (res.ok) {
        const updated = { ...user, ...data };
        setUser(updated);
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
        return { success: true };
      }
      return { success: false, error: "Update failed" };
    } catch (e) {
      return { success: false, error: "Cannot connect to server" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem("docintel-guest-count");
    setGuestQueries(0);
  };

  const incrementGuestQuery = () => {
    const newCount = guestQueries + 1;
    setGuestQueries(newCount);
    sessionStorage.setItem("docintel-guest-count", newCount.toString());
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, guestQueries, canQuery, login, signup, logout, incrementGuestQuery, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};