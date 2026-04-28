"use client";

import { RepositoriesContext } from '@/contexts/RepositoriesContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthRepository } from '@/repositories/AuthRepository';
import { ApiClient } from '@/utils/ApiClient';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useEffect, useState, ReactNode } from 'react';
import Login from '@/components/organisms/Login';
import Shell from '@/components/organisms/Shell';
import { CurrencyRepository } from '@/repositories/CurrencyRepository';

function AuthWrapper({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Shell>{children}</Shell>;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [repositoriesLoading, setRepositoriesLoading] = useState<boolean>(true);

  const [apiClient, setApiClient] = useState<ApiClient>();
  const [authRepository, setAuthRepository] = useState<AuthRepository>();
  const [currencyRepository, setCurrencyRepository] = useState<CurrencyRepository>();

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    const apiClient = new ApiClient(apiBaseUrl);
    const authRepository = new AuthRepository(apiBaseUrl + "/auth");
    const currencyRepository = new CurrencyRepository("/currency", apiClient);

    apiClient.setRefresher(refreshToken => authRepository.refreshTokens(refreshToken));

    setApiClient(apiClient);
    setAuthRepository(authRepository);
    setCurrencyRepository(currencyRepository);
  }, []);

  useEffect(() => {
    setRepositoriesLoading(!(
      !!apiClient &&
      !!authRepository &&
      !!currencyRepository
    ));
  }, [apiClient, authRepository, currencyRepository]);

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
