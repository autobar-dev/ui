import { Tokens } from "@/types/auth";

/**
 * API client utilities for authenticated requests.
 */

/**
 * Centralized API client that reads and refreshes auth tokens via injected callbacks.
 */
export class ApiClient {
    baseUrl: string;
    private auth?: AuthConfig;
    private refreshPromise: Promise<Tokens> | null = null;

    /**
     * Create a new API client bound to the provided base URL.
     */
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Configure auth callbacks sourced from AuthContext.
     */
    configure(auth: AuthConfig) {
        this.auth = auth;
    }

    /**
     * Perform a GET request with automatic token refresh on 401 responses.
     */
    public async get<TResponse>(url: string): Promise<TResponse> {
        return this.withAuthRetry(() => this.getInternal<TResponse>(url));
    }

    private async getInternal<TResponse>(url: string): Promise<TResponse> {
        const headers = this.buildHeaders();
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: "GET",
            headers
        });

        if (response.status === 401) {
            throw new UnauthorizedError("Unauthorized GET request");
        }

        if (!response.ok) {
            throw new Error(`Error making GET request: ${response.status}`);
        }

        const json: HttpResponse<TResponse> = await response.json();

        if (json.status === "error") {
            throw new Error("API error: " + json.error);
        }

        return json.data;
    }

    /**
     * Perform a POST request with automatic token refresh on 401 responses.
     */
    public async post<TResponse>(url: string, body: Record<string, any>): Promise<TResponse> {
        return this.withAuthRetry(() => this.postInternal<TResponse>(url, body));
    }

    private async postInternal<TResponse>(url: string, body: Record<string, any>): Promise<TResponse> {
        const headers = this.buildHeaders();
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        });

        if (response.status === 401) {
            throw new UnauthorizedError("Unauthorized POST request");
        }

        if (!response.ok) {
            throw new Error(`Error making POST request: ${response.status}`);
        }

        const json: HttpResponse<TResponse> = await response.json();

        if (json.status === "error") {
            throw new Error("API error: " + json.error);
        }

        return json.data;
    }

    private async withAuthRetry<TResponse>(action: () => Promise<TResponse>): Promise<TResponse> {
        try {
            return await action();
        } catch (error) {
            if (!(error instanceof UnauthorizedError)) {
                throw error;
            }

            await this.refreshTokens();
            return action();
        }
    }

    private buildHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json"
        };
        const accessToken = this.auth?.getTokens()?.accessToken;

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return headers;
    }

    private async refreshTokens(): Promise<void> {
        if (!this.auth) {
            throw new Error("Auth configuration not set");
        }

        const currentTokens = this.auth.getTokens();
        const refreshToken = currentTokens?.refreshToken;

        if (!refreshToken) {
            // Treat missing refresh token as a signed-out state to keep auth centralized.
            this.auth.onAuthFailure();
            throw new Error("Refresh token not available");
        }

        if (!this.refreshPromise) {
            this.refreshPromise = this.auth
                .refresh(refreshToken)
                .then((newTokens) => {
                    this.auth?.setTokens(newTokens);
                    return newTokens;
                })
                .finally(() => {
                    this.refreshPromise = null;
                });
        }

        try {
            await this.refreshPromise;
        } catch (error) {
            this.auth.onAuthFailure();
            throw error;
        }
    }
}

/**
 * Auth callbacks that keep token state centralized in AuthContext.
 */
type AuthConfig = {
    getTokens: () => Tokens | null;
    setTokens: (tokens: Tokens | null) => void;
    refresh: (refreshToken: string) => Promise<Tokens>;
    onAuthFailure: () => void;
};

class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

type HttpResponse<T> = {
    status: "ok" | "error";
    error: string;
    data: T;
};