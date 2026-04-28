"use client";

import { createContext } from "react";

import { ApiClient } from "@/utils/ApiClient";
import { AuthRepository } from "@/repositories/AuthRepository";
import { CurrencyRepository } from "@/repositories/CurrencyRepository";

type RepositoriesContextValues = {
    apiClient: ApiClient;
    authRepository: AuthRepository;
    currencyRepository: CurrencyRepository;
};

export const RepositoriesContext = createContext<RepositoriesContextValues>({
    apiClient: null as any,
    authRepository: null as any,
    currencyRepository: null as any,
});