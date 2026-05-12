import { IsValidData, Tokens } from "@/types/auth";

export class AuthRepository {
    serviceUrl: string;

    constructor(serviceUrl: string) {
        this.serviceUrl = serviceUrl;
    }

    async refreshTokens(refreshToken: string, setCookie: boolean = false): Promise<Tokens> {
        const resp = await fetch(this.serviceUrl + "/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh_token: refreshToken,
                set_cookie: setCookie,
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

    async login(email: string, password: string, rememberMe: boolean = false, setCookie: boolean = false): Promise<Tokens> {
        const resp = await fetch(this.serviceUrl + "/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                remember_me: rememberMe,
                set_cookie: setCookie,
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

    async logout(refreshToken: string): Promise<void> {
        const resp = await fetch(this.serviceUrl + "/logout", {
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
            throw new Error(err.message || "Failed to logout");
        }
    }

    async isTokenValid(accessToken: string): Promise<IsValidData> {
        let resp;
        try {
            resp = await fetch(this.serviceUrl + "/is-valid", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

        } catch (error) {
            console.error("Token validation request failed", error);
            throw new Error("Failed to validate token");
        }
        if (!resp.ok) {
            const err = await resp.json();
            throw new Error(err.message || "Failed to validate token");
        }

        const json = await resp.json();

        if (!!json.error) {
            throw new Error(json.error.message || "Failed to validate token");
        }

        return json.data as IsValidData;
    }

    async getModuleLoginChallenge(): Promise<{ challenge_base64: string, expires_at: string }> {
        const resp = await fetch(this.serviceUrl + "/module/login/challenge", {
            method: "POST",
        });

        if (!resp.ok) {
            const err = await resp.json();
            throw new Error(err.message || "Failed to get module login challenge");
        }

        const json = await resp.json();
        return json.data;
    }

    async loginModule(certificatePem: string, challengeBase64: string, signatureBase64: string): Promise<Tokens> {
        const resp = await fetch(this.serviceUrl + "/module/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                certificate_pem: certificatePem,
                challenge_base64: challengeBase64,
                signature_base64: signatureBase64,
            }),
        });

        if (!resp.ok) {
            const err = await resp.json();
            throw new Error(err.message || "Failed to login module");
        }

        const json = await resp.json();

        return {
            accessToken: json.data.access_token,
            refreshToken: json.data.refresh_token,
        };
    }
}