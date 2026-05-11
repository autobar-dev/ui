"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { IsValidData, Tokens, UserRole } from "@/types/auth";
import { AuthRepository } from "@/repositories/AuthRepository";
import { decodeJWT } from "@/utils/auth";

const ALLOWED_ROLES: UserRole[] = ["admin", "owner", "maintainer"];

type AuthContextValues = {
  tokens: Tokens | null;
  setTokens: (tokens: Tokens | null) => void;
  isAuthenticated: boolean;
  role: UserRole | null;
  logout: (authRepository: AuthRepository) => void;
};

const AuthContext = createContext<AuthContextValues | undefined>(undefined);

/**
 * Provide centralized authentication state and token persistence.
 */
export function AuthProvider({ children }: { children: ReactNode; }) {
  const [tokens, setTokensState] = useState<Tokens | null>(() => {
    if (typeof window === "undefined") return null;
    
    const savedTokens = localStorage.getItem("auth_tokens");
    if (!savedTokens) {
      return null;
    }

    try {
      const parsed = JSON.parse(savedTokens) as Tokens;
      const decoded = decodeJWT<IsValidData>(parsed.accessToken);
      if (decoded && !ALLOWED_ROLES.includes(decoded.rol)) {
        localStorage.removeItem("auth_tokens");
        return null;
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse saved tokens", e);
      return null;
    }
  });

  const setTokens = (newTokens: Tokens | null) => {
    if (newTokens) {
      const decoded = decodeJWT<IsValidData>(newTokens.accessToken);
      if (decoded && !ALLOWED_ROLES.includes(decoded.rol)) {
        throw new Error("You do not have permission to access the dashboard.");
      }
      
      setTokensState(newTokens);
      localStorage.setItem("auth_tokens", JSON.stringify(newTokens));
    } else {
      setTokensState(null);
      localStorage.removeItem("auth_tokens");
    }
  };

  const logout = (authRepository: AuthRepository) => {
    authRepository.logout(tokens?.refreshToken || "").finally(() => {
      setTokens(null);
    });
  };

  const isAuthenticated = !!tokens;

  const role = useMemo(() => {
    if (!tokens?.accessToken) return null;
    const decoded = decodeJWT<IsValidData>(tokens.accessToken);
    return decoded?.rol || null;
  }, [tokens]);

  return (
    <AuthContext.Provider value={{ tokens, setTokens, isAuthenticated, role, logout }}>
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
