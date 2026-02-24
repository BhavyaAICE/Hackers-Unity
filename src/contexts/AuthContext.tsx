import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken, removeToken, getToken } from "@/lib/apiClient";
import type { ApiUser, AuthResponse } from "@/types/api.types";

interface AuthContextType {
  user: ApiUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; needsEmailConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: (credential: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session from localStorage on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user: me } = await api.get<{ user: ApiUser }>("/api/auth/me");
        setUser(me);
      } catch {
        removeToken();
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const data = await api.publicPost<AuthResponse>("/api/auth/signup", {
        email,
        password,
        fullName,
      });
      setToken(data.token);
      setUser(data.user);
      navigate("/");
      return { error: null, needsEmailConfirmation: false };
    } catch (err: any) {
      return { error: { message: err.message }, needsEmailConfirmation: false };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.publicPost<AuthResponse>("/api/auth/login", {
        email,
        password,
      });
      setToken(data.token);
      setUser(data.user);

      if (data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message } };
    }
  };

  // Google OAuth — POST Google ID token to backend, get our JWT back
  const signInWithGoogle = async (credential: string) => {
    try {
      const data = await api.publicPost<AuthResponse>("/api/auth/google", { idToken: credential });
      setToken(data.token);
      setUser(data.user);
      if (data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message } };
    }
  };

  const signOut = async () => {
    removeToken();
    setUser(null);
    navigate("/login");
  };

  const resetPassword = async (email: string) => {
    try {
      await api.publicPost("/api/auth/forgot-password", { email });
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message } };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
