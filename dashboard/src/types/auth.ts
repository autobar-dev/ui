export type UserRole = "admin" | "owner" | "maintainer" | "user";

export type Tokens = {
    accessToken: string;
    refreshToken: string;
};

export type IsValidData = {
    sub_typ: string;
    sub: string;
    rol: UserRole;
};