import { Tokens } from "@/types/auth";

/**
 * API client utilities for authenticated requests.
 */

/**
 * Centralized API client that handles authentication, token refreshes, and retries.
 */
export class ApiClient {
    baseUrl: string;
    private tokens: Tokens | null = null;
    private auth?: AuthConfig;
    private refreshPromise: Promise<Tokens> | null = null;

    /**
     * Create a new API client bound to the provided base URL.
     */
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Set the current session tokens.
     */
    public setTokens(tokens: Tokens | null) {
        this.tokens = tokens;
    }

    /**
     * Get the current session tokens.
     */
    public getTokens(): Tokens | null {
        return this.tokens;
    }

    /**
     * Configure auth callbacks.
     */
    public configure(auth: AuthConfig) {
        this.auth = auth;
    }

    /**
     * Perform a GET request with automatic token refresh on 401 responses.
     */
    public async get<TResponse>(url: string): Promise<TResponse> {
        return this.withAuthRetry(() => this.getInternal<TResponse>(url));
    }

    /**
     * Perform a POST request with automatic token refresh on 401 responses.
     */
    public async post<TResponse>(url: string, body: Record<string, any>): Promise<TResponse> {
        return this.withAuthRetry(() => this.postInternal<TResponse>(url, body));
    }

    /**
     * Perform a PUT request with automatic token refresh on 401 responses.
     */
    public async put<TResponse>(url: string, body: Record<string, any>): Promise<TResponse> {
        return this.withAuthRetry(() => this.putInternal<TResponse>(url, body));
    }

    /**
     * Perform a PATCH request with automatic token refresh on 401 responses.
     */
    public async patch<TResponse>(url: string, body: Record<string, any>): Promise<TResponse> {
        return this.withAuthRetry(() => this.patchInternal<TResponse>(url, body));
    }

    /**
     * Perform a DELETE request with automatic token refresh on 401 responses.
     */
    public async delete<TResponse>(url: string): Promise<TResponse> {
        return this.withAuthRetry(() => this.deleteInternal<TResponse>(url));
    }

    /**
     * Perform a POST request with FormData with automatic token refresh on 401 responses.
     */
    public async postFormData<TResponse>(url: string, formData: FormData): Promise<TResponse> {
        return this.withAuthRetry(() => this.postFormDataInternal<TResponse>(url, formData));
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

    private async putInternal<TResponse>(url: string, body: Record<string, any>): Promise<TResponse> {
        const headers = this.buildHeaders();
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(body)
        });

        if (response.status === 401) {
            throw new UnauthorizedError("Unauthorized PUT request");
        }

        if (!response.ok) {
            throw new Error(`Error making PUT request: ${response.status}`);
        }

        const json: HttpResponse<TResponse> = await response.json();

        if (json.status === "error") {
            throw new Error("API error: " + json.error);
        }

        return json.data;
    }

    private async patchInternal<TResponse>(url: string, body: Record<string, any>): Promise<TResponse> {
        const headers = this.buildHeaders();
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(body)
        });

        if (response.status === 401) {
            throw new UnauthorizedError("Unauthorized PATCH request");
        }

        if (!response.ok) {
            throw new Error(`Error making PATCH request: ${response.status}`);
        }

        const json: HttpResponse<TResponse> = await response.json();

        if (json.status === "error") {
            throw new Error("API error: " + json.error);
        }

        return json.data;
    }

    private async deleteInternal<TResponse>(url: string): Promise<TResponse> {
        const headers = this.buildHeaders();
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: "DELETE",
            headers
        });

        if (response.status === 401) {
            throw new UnauthorizedError("Unauthorized DELETE request");
        }

        if (!response.ok) {
            throw new Error(`Error making DELETE request: ${response.status}`);
        }

        const json: HttpResponse<TResponse> = await response.json();

        if (json.status === "error") {
            throw new Error("API error: " + json.error);
        }

        return json.data;
    }

    private async postFormDataInternal<TResponse>(url: string, formData: FormData): Promise<TResponse> {
        const headers = this.buildHeaders();
        // Remove Content-Type so the browser sets it with the correct boundary
        delete headers["Content-Type"];

        const response = await fetch(`${this.baseUrl}${url}`, {
            method: "POST",
            headers,
            body: formData
        });

        if (response.status === 401) {
            throw new UnauthorizedError("Unauthorized POST FormData request");
        }

        if (!response.ok) {
            throw new Error(`Error making POST FormData request: ${response.status}`);
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

            // If we got a 401, try to refresh tokens and retry the action once.
            await this.refreshTokens();
            return action();
        }
    }

    private buildHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json"
        };

        if (this.tokens?.accessToken) {
            headers["Authorization"] = `Bearer ${this.tokens.accessToken}`;
        }

        return headers;
    }

    private async refreshTokens(): Promise<void> {
        if (!this.auth) {
            throw new Error("Auth configuration not set");
        }

        const refreshToken = this.tokens?.refreshToken;

        if (!refreshToken) {
            this.auth.onAuthFailure();
            throw new Error("Refresh token not available");
        }

        if (!this.refreshPromise) {
            this.refreshPromise = this.auth
                .refresh(refreshToken)
                .then((newTokens) => {
                    // Update internal tokens immediately so retries use the fresh ones
                    this.tokens = newTokens;
                    
                    // Notify the external system (e.g. AuthContext) of the update
                    this.auth?.onTokensUpdated(newTokens);
                    
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
 * Auth callbacks that bridge ApiClient with the application's auth state.
 */
type AuthConfig = {
    onTokensUpdated: (tokens: Tokens) => void;
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