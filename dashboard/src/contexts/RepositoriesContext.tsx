"use client";

import { createContext } from "react";

import { ApiClient } from "@/utils/ApiClient";
import { AuthRepository } from "@/repositories/AuthRepository";
import { CurrencyRepository } from "@/repositories/CurrencyRepository";
import { UserRepository } from "@/repositories/UserRepository";
import { ModuleRepository } from "@/repositories/ModuleRepository";
import { ProductRepository } from "@/repositories/ProductRepository";

type RepositoriesContextValues = {
    apiClient: ApiClient;
    authRepository: AuthRepository;
    currencyRepository: CurrencyRepository;
    userRepository: UserRepository;
    moduleRepository: ModuleRepository;
    productRepository: ProductRepository;
};

export const RepositoriesContext = createContext<RepositoriesContextValues>({
    apiClient: null as any,
    authRepository: null as any,
    currencyRepository: null as any,
    userRepository: null as any,
    moduleRepository: null as any,
    productRepository: null as any,
});