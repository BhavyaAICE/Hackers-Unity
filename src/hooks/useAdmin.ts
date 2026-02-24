import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/apiClient";

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    // isAdmin flag comes directly from the JWT user object
    setIsAdmin(user.isAdmin || false);
    setLoading(false);
  }, [user]);

  return { isAdmin, loading };
};
