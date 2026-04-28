import { Tokens } from "@/types/auth";

export class AuthRepository {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async refreshTokens(refreshToken: string): Promise<Tokens> {
        const resp = await fetch(this.baseUrl + "/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh_token: refreshToken,
            }),
        });

        if (!resp.ok) {
            const err = await resp.json();
            throw new Error(err.message || "Failed to refresh tokens");
        }

        const json = await resp.json();

        return {
            accessToken: json.data.access_token,
            refreshToken: json.data.refresh_token,
        };
    }

    async login(email: string, password: string): Promise<Tokens> {
        const resp = await fetch(this.baseUrl + "/auth/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!resp.ok) {
            const err = await resp.json();
            throw new Error(err.message || "Failed to login");
        }

        const json = await resp.json();

        return {
            accessToken: json.data.access_token,
            refreshToken: json.data.refresh_token,
        };
    }
}