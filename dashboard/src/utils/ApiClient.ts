import { Tokens } from "@/types/auth";

export class ApiClient {
    baseUrl: string;

    accessToken?: string;
    refreshToken?: string;

    private refresher?: (refreshToken: string) => Promise<Tokens>;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setRefresher(refresher: (refreshToken: string) => Promise<Tokens>) {
        this.refresher = refresher;
    }

    async refreshTokens() {
        if (!this.refreshToken || !this.refresher) {
            throw new Error("Refresher or refresh token not available");
        }

        const newTokens = await this.refresher(this.refreshToken);
        this.accessToken = newTokens.accessToken;
        this.refreshToken = newTokens.refreshToken;
    }

    public async get<TResponse>(url: string): Promise<TResponse> {
        try {
            return await this.getInternal<TResponse>(url);
        } catch (error) {
            await this.refreshTokens();
            return await this.getInternal<TResponse>(url);
        }
    }

    private async getInternal<TResponse>(url: string): Promise<TResponse> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error making GET request: ${response.status}`);
        }

        const json: HttpResponse<TResponse> = await response.json();

        if (json.status === "error") {
            throw new Error(json.error);
        }

        return json.data;
    }

    public async post<TResponse>(url: string, body: Record<string, any>): Promise<TResponse> {
        try {
            return await this.postInternal<TResponse>(url, body);
        } catch (error) {
            await this.refreshTokens();
            return await this.postInternal<TResponse>(url, body);
        }
    }

    private async postInternal<TResponse>(url: string, body: Record<string, any>): Promise<TResponse> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error making POST request: ${response.status}`);
        }

        const json: HttpResponse<TResponse> = await response.json();

        if (json.status === "error") {
            throw new Error(json.error);
        }

        return json.data;
    }
}

type HttpResponse<T> = {
    status: "ok" | "error";
    error: string;
    data: T;
}