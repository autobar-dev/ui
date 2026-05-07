"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Tokens } from "@/types/auth";
import { AuthRepository } from "@/repositories/AuthRepository";

type AuthContextValues = {
  tokens: Tokens | null;
  setTokens: (tokens: Tokens | null) => void;
  isAuthenticated: boolean;
  logout: (authRepository: AuthRepository) => void;
};

const AuthContext = createContext<AuthContextValues | undefined>(undefined);

/**
 * Provide centralized authentication state and token persistence.
 */
export function AuthProvider({ children }: { children: ReactNode; }) {
  const [tokens, setTokensState] = useState<Tokens | null>(() => {
    const savedTokens = localStorage.getItem("auth_tokens");
    if (!savedTokens) {
      return null;
    }

    try {
      return JSON.parse(savedTokens) as Tokens;
    } catch (e) {
      console.error("Failed to parse saved tokens", e);
      return null;
    }
  });

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

/**
 * Access the current authentication state and actions.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
