"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Tokens } from "@/types/auth";
import { AuthRepository } from "@/repositories/AuthRepository";

type AuthContextValues = {
  tokens: Tokens | null;
  setTokens: (tokens: Tokens | null) => void;
  isAuthenticated: boolean;
  logout: (authRepository: AuthRepository) => void;
};

const AuthContext = createContext<AuthContextValues | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode; }) {
  const [tokens, setTokensState] = useState<Tokens | null>(null);

  useEffect(() => {
    const savedTokens = localStorage.getItem("auth_tokens");
    if (savedTokens) {
      try {
        setTokensState(JSON.parse(savedTokens));
      } catch (e) {
        console.error("Failed to parse saved tokens", e);
      }
    }
  }, []);

  const setTokens = (newTokens: Tokens | null) => {
    setTokensState(newTokens);
    if (newTokens) {
      localStorage.setItem("auth_tokens", JSON.stringify(newTokens));
    } else {
      localStorage.removeItem("auth_tokens");
    }
  };

  const logout = (authRepository: AuthRepository) => {
    authRepository.logout(tokens?.refreshToken || "").finally(() => {
      setTokens(null);
    });
  };

  const isAuthenticated = !!tokens;

  return (
    <AuthContext.Provider value={{ tokens, setTokens, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
