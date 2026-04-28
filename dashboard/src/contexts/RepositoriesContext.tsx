"use client";

import { createContext } from "react";

import { ApiClient } from "@/utils/ApiClient";
import { AuthRepository } from "@/repositories/AuthRepository";

type RepositoriesContextValues = {
    apiClient: ApiClient;
    authRepository: AuthRepository;
};

export const RepositoriesContext = createContext<RepositoriesContextValues>({
    apiClient: null as any,
    authRepository: null as any,
});