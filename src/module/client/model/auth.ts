export interface JwtResponse {
    token: string;
}

export interface LoginArgs {
    username: string;
    password: string;
}

export type LoginResponse = JwtResponse;

export interface RegisterArgs {
    username: string;
    password: string;
    name: string;

    options?: {
        createSession?: boolean;
    }
}

export type RegisterResponse = JwtResponse;

export type RefreshResponse = JwtResponse;