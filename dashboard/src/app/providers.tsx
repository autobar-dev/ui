"use client";

import { RepositoriesContext } from '@/contexts/RepositoriesContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthRepository } from '@/repositories/AuthRepository';
import { ApiClient } from '@/utils/ApiClient';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useEffect, useState, ReactNode, useContext, useRef } from 'react';
import Login from '@/components/organisms/Login';
import Shell from '@/components/organisms/Shell';
import { CurrencyRepository } from '@/repositories/CurrencyRepository';
import { UserRepository } from "@/repositories/UserRepository";
import { ModuleRepository } from "@/repositories/ModuleRepository";
import { Tokens } from "@/types/auth";

function AuthWrapper({ children }: { children: ReactNode; }) {
  const { isAuthenticated, tokens, setTokens } = useAuth();
  const { apiClient, authRepository } = useContext(RepositoriesContext);
  const tokensRef = useRef<Tokens | null>(tokens);

  useEffect(() => {
    tokensRef.current = tokens;
  }, [tokens]);

  useEffect(() => {
    if (!apiClient || !authRepository) {
      return;
    }

    apiClient.configure({
      getTokens: () => tokensRef.current,
      setTokens,
      refresh: (refreshToken: string) => authRepository.refreshTokens(refreshToken),
      onAuthFailure: () => setTokens(null)
    });
  }, [apiClient, authRepository, setTokens]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Shell>{children}</Shell>;
}

export default function Providers({ children }: { children: ReactNode; }) {
  const [repositoriesLoading, setRepositoriesLoading] = useState<boolean>(true);

  const [apiClient, setApiClient] = useState<ApiClient>();
  const [authRepository, setAuthRepository] = useState<AuthRepository>();
  const [currencyRepository, setCurrencyRepository] = useState<CurrencyRepository>();
  const [userRepository, setUserRepository] = useState<UserRepository>();
  const [moduleRepository, setModuleRepository] = useState<ModuleRepository>();

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    const apiClient = new ApiClient(apiBaseUrl);
    const authRepository = new AuthRepository(apiBaseUrl + "/auth");
    const currencyRepository = new CurrencyRepository("/currency", apiClient);
    const userRepository = new UserRepository("/user", apiClient);
    const moduleRepository = new ModuleRepository("/module", apiClient);

    setApiClient(apiClient);
    setAuthRepository(authRepository);
    setCurrencyRepository(currencyRepository);
    setUserRepository(userRepository);
    setModuleRepository(moduleRepository);
  }, []);

  useEffect(() => {
    setRepositoriesLoading(!(
      !!apiClient &&
      !!authRepository &&
      !!currencyRepository &&
      !!userRepository &&
      !!moduleRepository
    ));
  }, [apiClient, authRepository, currencyRepository, userRepository, moduleRepository]);

  return (
    <>
      {repositoriesLoading ? (
        <div className="flex items-center justify-center h-screen bg-white">
          <p className="text-tremor-brand font-medium">Loading...</p>
        </div>
      ) : (
        <RepositoriesContext.Provider value={{
          apiClient: apiClient!,
          authRepository: authRepository!,
          currencyRepository: currencyRepository!,
          userRepository: userRepository!,
          moduleRepository: moduleRepository!,
        }}>
          <AuthProvider>
            <AuthWrapper>
              {children}
            </AuthWrapper>
          </AuthProvider>
        </RepositoriesContext.Provider>
      )}
      <ProgressBar
        height="3px"
        color="#3b82f6"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
