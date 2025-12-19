import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; needsEmailConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    // Subscribe FIRST to avoid missing the "SIGNED_IN" event when Supabase
    // detects a session in the URL after email confirmation.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // THEN fetch the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm-email`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      if (error.message.includes("email_provider_disabled") || error.message.includes("Email signups are disabled")) {
        return {
          error: {
            ...error,
            message: "Email registration is currently disabled. Please contact the administrator or try signing in with Google.",
          },
          needsEmailConfirmation: false,
        };
      }
      return { error, needsEmailConfirmation: false };
    }

    // When email confirmation is enabled, Supabase returns user but NO session
    // When email confirmation is disabled, both user and session are returned
    const needsEmailConfirmation = data.user && !data.session;

    // If email confirmation is disabled, user is auto-logged in, navigate to home
    if (!needsEmailConfirmation && data.session) {
      navigate("/");
    }

    return { error: null, needsEmailConfirmation };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("email_provider_disabled") || error.message.includes("Email") && error.message.includes("disabled")) {
        return {
          error: {
            ...error,
            message: "Email login is currently disabled. Please try signing in with Google or contact the administrator.",
          },
        };
      }
      return { error };
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("is_admin")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile?.is_admin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }

    return { error: null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      if (error.message.includes("email_provider_disabled") || error.message.includes("Email") && error.message.includes("disabled")) {
        return {
          error: {
            ...error,
            message: "Password reset is currently disabled. Please contact the administrator.",
          },
        };
      }
    }

    return { error };
  };

  const value = {
    user,
    session,
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
