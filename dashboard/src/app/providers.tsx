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
import { ProductRepository } from '@/repositories/ProductRepository';
import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import { WalletRepository } from '@/repositories/WalletRepository';
import { FileRepository } from '@/repositories/FileRepository';

const myColor: MantineColorsTuple = [
  '#eff6ff',
  '#dbeafe',
  '#bfdbfe',
  '#93c5fd',
  '#60a5fa',
  '#3b82f6',
  '#2563eb',
  '#1d4ed8',
  '#1e40af',
  '#1e3a8a',
];

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: myColor,
  },
  fontFamily: 'inherit',
  defaultRadius: 'xl',
  headings: {
    fontWeight: '500',
  },
  components: {
    Card: {
      defaultProps: {
        radius: '32px',
        withBorder: false,
      },
      styles: {
        root: {
          boxShadow: '0 4px 20px -5px rgb(0 0 0 / 0.05)',
        }
      }
    },
    Button: {
      defaultProps: {
        radius: 'xl',
      }
    },
    TextInput: {
      defaultProps: {
        radius: 'xl',
      }
    },
    PasswordInput: {
      defaultProps: {
        radius: 'xl',
      }
    }
  }
});

function AuthWrapper({ children }: { children: ReactNode; }) {
  const { isAuthenticated, tokens, setTokens } = useAuth();
  const { apiClient, authRepository } = useContext(RepositoriesContext);

  useEffect(() => {
    if (!apiClient || !authRepository) {
      return;
    }

    // Initialize ApiClient with current tokens
    apiClient.setTokens(tokens);

    apiClient.configure({
      onTokensUpdated: (newTokens: Tokens) => setTokens(newTokens),
      refresh: (refreshToken: string) => authRepository.refreshTokens(refreshToken),
      onAuthFailure: () => setTokens(null)
    });
  }, [apiClient, authRepository, tokens, setTokens]);

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
  const [productRepository, setProductRepository] = useState<ProductRepository>();
  const [walletRepository, setWalletRepository] = useState<WalletRepository>();
  const [fileRepository, setFileRepository] = useState<FileRepository>();

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    const apiClient = new ApiClient(apiBaseUrl);
    const authRepository = new AuthRepository(apiBaseUrl + "/auth");
    const currencyRepository = new CurrencyRepository("/currency", apiClient);
    const userRepository = new UserRepository("/user", apiClient);
    const moduleRepository = new ModuleRepository("/module", apiClient);
    const productRepository = new ProductRepository("/product", apiClient);
    const walletRepository = new WalletRepository("/wallet", apiClient);
    const fileRepository = new FileRepository("/file", apiClient);

    setApiClient(apiClient);
    setAuthRepository(authRepository);
    setCurrencyRepository(currencyRepository);
    setUserRepository(userRepository);
    setModuleRepository(moduleRepository);
    setProductRepository(productRepository);
    setWalletRepository(walletRepository);
    setFileRepository(fileRepository);
  }, []);

  useEffect(() => {
    setRepositoriesLoading(!(
      !!apiClient &&
      !!authRepository &&
      !!currencyRepository &&
      !!userRepository &&
      !!moduleRepository &&
      !!productRepository &&
      !!walletRepository &&
      !!fileRepository
    ));
  }, [apiClient, authRepository, currencyRepository, userRepository, moduleRepository, productRepository, walletRepository, fileRepository]);

  return (
    <MantineProvider theme={theme}>
      {repositoriesLoading ? (
        <div className="flex items-center justify-center h-screen bg-white">
          <p className="text-blue-600">Loading...</p>
        </div>
      ) : (
        <RepositoriesContext.Provider value={{
          apiClient: apiClient!,
          authRepository: authRepository!,
          currencyRepository: currencyRepository!,
          userRepository: userRepository!,
          moduleRepository: moduleRepository!,
          productRepository: productRepository!,
          walletRepository: walletRepository!,
          fileRepository: fileRepository!,
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
    </MantineProvider>
  );
}
