import type {
    JwtResponse,
    LoginArgs,
    LoginResponse,
    RefreshResponse,
    RegisterArgs, RegisterResponse
} from "./model/auth.ts";
import type {IdentityUserResponse} from "./model/user.ts";

export interface GatewayService {

    /**
     * Login.
     *
     * @param args The args
     */
    login(args: LoginArgs): Promise<LoginResponse>;

    /**
     * Register and login.
     *
     * @param args The args
     */
    register(args: RegisterArgs): Promise<RegisterResponse>;

    /**
     * Refresh a current session to get a new token.
     */
    refresh(): Promise<RefreshResponse>;

    /**
     * Get the current user's identity.
     */
    getIdentity(): Promise<IdentityUserResponse>;
}

/**
 * A default implementation of the GatewayService that works with the latest
 * API version.
 */
export class GatewayServiceImpl implements GatewayService {
    private readonly baseUrl: string;
    private token: string|undefined;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.token = undefined;
    }

    async login(args: LoginArgs): Promise<LoginResponse> {
        const body = {
            username: args.username,
            password: args.password,
        };

        return this.internalFetch<LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(body),
        })
            .then((res) => this.mapJwtResponse(res));
    }

    async register(args: RegisterArgs): Promise<RegisterResponse> {
        const body = {
            username: args.username,
            password: args.password,
            name: args.name,
        };
        const params = this.buildQueryParams({
            createSession: args.options?.createSession,
        });

        return this.internalFetch<LoginResponse>(`/auth/register?${params}`, {
            method: "POST",
            body: JSON.stringify(body),
        })
            .then((res) => this.mapJwtResponse(res));
    }

    async refresh(): Promise<RefreshResponse> {
        return this.internalFetch<RefreshResponse>("/auth/refresh")
            .then((res) => this.mapJwtResponse(res));
    }

    async getIdentity(): Promise<IdentityUserResponse> {
        return this.internalFetch("/users/me");
    }

    /**
     * A mapper to set the token to use.
     *
     * @param response The response
     */
    private mapJwtResponse(response: JwtResponse) {
        this.token = response.token;

        return response;
    }

    /**
     * Fetch data and map it.
     *
     * @param path The path to fetch
     * @param init The fetch init to use
     * @param mapper The mapper function
     */
    private async internalFetch<T>(
        path: string,
        init: RequestInit = {},
        mapper: (data: never) => T = (data) => data
    ): Promise<T> {
        const token = this.token;

        return fetch(this.baseUrl + path, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {}),
                ...init.headers,
            },
            credentials: "include",
        })
            .then((res) => res.json())
            // All payload is always in the data field
            .then((res) => res.data)
            .then((data) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return mapper(data);
            })
            .catch((err) => {
                console.log(err);

                throw err;
            });
    }

    /**
     * Build URL query params from args.
     *
     * @param args The args
     */
    private buildQueryParams(
        args: Record<string, string | number | boolean | undefined>
    ): string {
        const params = new URLSearchParams();

        Object.entries(args)
            .filter(([, value]) => value !== undefined)
            .forEach(([key, value]) => {
                params.set(key, value!.toString());
            })

        return params.toString();
    }
}

/**
 * A service rejecting calls, which is used as a default value for react context.
 */
export class UnimplementedGatewayService implements GatewayService {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async login(_args: LoginArgs): Promise<LoginResponse> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async register(_args: RegisterArgs): Promise<RegisterResponse> {
        return this.unimplemented();
    }

    async refresh(): Promise<RefreshResponse> {
        return this.unimplemented();
    }

    async getIdentity(): Promise<IdentityUserResponse> {
        return this.unimplemented();
    }

    private async unimplemented() {
        return Promise.reject("Not implemented");
    }
}