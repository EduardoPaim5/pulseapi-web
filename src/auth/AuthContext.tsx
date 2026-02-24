import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/endpoints";
import type { AuthResponse, MeResponse } from "../api/types";

type AuthContextValue = {
  user: MeResponse | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: (tokenOverride?: string | null) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "pulseapi_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const persistToken = useCallback((auth: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, auth.accessToken);
    setToken(auth.accessToken);
  }, []);

  const clearToken = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshMe = useCallback(async (tokenOverride?: string | null) => {
    const currentToken = tokenOverride ?? token;
    if (!currentToken) {
      setUser(null);
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      clearToken();
    }
  }, [token, clearToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      const auth = await authApi.login({ email, password });
      persistToken(auth);
      await refreshMe(auth.accessToken);
    },
    [persistToken, refreshMe]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const auth = await authApi.register({ email, password });
      persistToken(auth);
      await refreshMe(auth.accessToken);
    },
    [persistToken, refreshMe]
  );

  const logout = useCallback(() => {
    clearToken();
  }, [clearToken]);

  useEffect(() => {
    const init = async () => {
      await refreshMe();
      setLoading(false);
    };
    void init();
  }, [refreshMe]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      refreshMe,
    }),
    [user, token, loading, login, register, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
