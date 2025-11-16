import type {
    JwtResponse,
    LoginArgs,
    LoginResponse,
    RefreshResponse,
    RegisterArgs, RegisterResponse
} from "./model/auth.ts";
import type {
    ChangeRoleArgs,
    DeleteUserArgs,
    IdentityUserResponse,
    ListUsersArgs,
    ListUsersResponse
} from "./model/user.ts";
import type {PageArgs} from "./model/util.ts";
import {StatusError} from "./error/StatusError.ts";
import type {
    CreateThemeArgs,
    DeleteThemeArgs,
    GetThemeArgs, InspectThemeArgs, InspectThemeResponse,
    ListThemesArgs,
    ListThemesResponse, Theme, UpdateThemeArgs
} from "./model/theme.ts";
import type {ListCampaignsArgs, ListCampaignsResponse} from "./model/campaign.ts";

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
     * Logout the current user.
     */
    logout(): Promise<unknown>;

    /**
     * Get the current user's identity.
     */
    getIdentity(): Promise<IdentityUserResponse>;

    /**
     * List users.
     *
     * @param args The args
     */
    listUsers(args: ListUsersArgs): Promise<ListUsersResponse>;

    /**
     * Delete a user.
     *
     * @param args The args
     */
    deleteUser(args: DeleteUserArgs): Promise<unknown>;

    /**
     * Change a user's role.
     *
     * @param args The args
     */
    changeUserRole(args: ChangeRoleArgs): Promise<unknown>;

    /**
     * Create a theme.
     *
     * @param args The args
     */
    createTheme(args: CreateThemeArgs): Promise<unknown>;

    /**
     * Delete a theme.
     *
     * @param args The args
     */
    deleteTheme(args: DeleteThemeArgs): Promise<unknown>;

    /**
     * Get a theme.
     *
     * @param args The args
     */
    getTheme(args: GetThemeArgs): Promise<Theme>;

    /**
     * Inspect a theme.
     *
     * @param args The args
     */
    inspectTheme(args: InspectThemeArgs): Promise<InspectThemeResponse>;

    /**
     * Update a theme.
     *
     * @param args The args
     */
    updateTheme(args: UpdateThemeArgs): Promise<unknown>;

    /**
     * List themes.
     *
     * @param args The args
     */
    listThemes(args: ListThemesArgs): Promise<ListThemesResponse>;

    /**
     * List campaigns.
     *
     * @param args The args
     */
    listCampaigns(args: ListCampaignsArgs): Promise<ListCampaignsResponse>;
}

/**
 * Create a default gateway service.
 *
 * @param baseUrl The base URL
 */
export const createDefaultGatewayService = (baseUrl: string) => {
    return new GatewayServiceImpl(baseUrl);
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
            .then((res) => this.mapJwtResponse(res))
            .catch((err) => {
                this.mapErrIfStatus(err, 401, new Error("Invalid credentials"));

                throw err;
            })
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

    async logout(): Promise<unknown> {
        return this.internalFetch<unknown>("/auth/logout", {
            method: "POST",
        });
    }

    async getIdentity(): Promise<IdentityUserResponse> {
        return this.internalFetch("/users/me");
    }

    async listUsers(args: ListUsersArgs): Promise<ListUsersResponse> {
        const params = this.buildPageParams(args);

        return this.internalFetch<ListUsersResponse>(`/users?${params}`);
    }

    async deleteUser(args: DeleteUserArgs): Promise<unknown> {
        return this.internalFetch<unknown>("/users/" + args.userId, {
            method: "DELETE",
        });
    }

    async changeUserRole(args: ChangeRoleArgs): Promise<unknown> {
        const body = {
            role: args.role,
        }

        return this.internalFetch<unknown>(`/users/${args.userId}/role`, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    }

    async createTheme(args: CreateThemeArgs): Promise<unknown> {
        const body = {
            name: args.name,
            description: args.description,
        }

        return this.internalFetch<unknown>(`/themes`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    async deleteTheme(args: DeleteThemeArgs): Promise<unknown> {
        return this.internalFetch<unknown>(`/themes/${args.themeId}`, {
            method: "DELETE",
        });
    }

    async getTheme(args: GetThemeArgs): Promise<Theme> {
        return this.internalFetch<Theme>(`/themes/${args.themeId}`);
    }

    async inspectTheme(args: InspectThemeArgs): Promise<InspectThemeResponse> {
        return this.internalFetch<InspectThemeResponse>(`/themes/${args.themeId}/inspect`);
    }

    async updateTheme(args: UpdateThemeArgs): Promise<unknown> {
        const body = {
            name: args.name,
            description: args.description,
        }

        return this.internalFetch<unknown>(`/themes/${args.themeId}`, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    }

    async listThemes(args: ListThemesArgs): Promise<ListThemesResponse> {
        const params = this.buildPageParams(args);

        return this.internalFetch<ListThemesResponse>(`/themes?${params}`);
    }

    async listCampaigns(args: ListCampaignsArgs): Promise<ListCampaignsResponse> {
        const additionalParams = {
            ...args.themeId !== undefined ? {themeId: args.themeId} : {},
            ...args.assigned !== undefined ? {assigned: args.assigned} : {},
        }
        const params = this.buildPageParams(args, additionalParams);

        return this.internalFetch<ListCampaignsResponse>(`/campaigns?${params}`);
    }

    /**
     * Map an error if it matches the given status.
     *
     * @param err The error
     * @param status The status to match
     * @param mapTo The error to map to
     */
    private mapErrIfStatus(err: unknown, status: number, mapTo: Error) {
        if (err instanceof StatusError) {
            if (err.status === status) {
                throw mapTo;
            }
        }
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
            .then((res) => {
                if (!res.ok) {
                    throw new StatusError(res.status);
                }

                return res;
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

    /**
     * Build page params from args.
     *
     * @param args The args
     * @param additionalParams Additional params to include
     */
    private buildPageParams(
        args: PageArgs, additionalParams?: Record<string, string | number | boolean | undefined>): string {
        const argsRecord = {
            pageIndex: args.page.index,
            pageSize: args.page.size,
            ...additionalParams,
        };

        return this.buildQueryParams(argsRecord);
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

    async logout(): Promise<unknown> {
        return this.unimplemented();
    }

    async getIdentity(): Promise<IdentityUserResponse> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async listUsers(_args: ListUsersArgs): Promise<ListUsersResponse> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deleteUser(_args: DeleteUserArgs): Promise<unknown> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async changeUserRole(_args: ChangeRoleArgs): Promise<unknown> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async createTheme(_args: CreateThemeArgs): Promise<unknown> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deleteTheme(_args: DeleteThemeArgs): Promise<unknown> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getTheme(_args: GetThemeArgs): Promise<Theme> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async inspectTheme(_args: InspectThemeArgs): Promise<InspectThemeResponse> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async updateTheme(_args: UpdateThemeArgs): Promise<unknown> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async listThemes(_args: ListThemesArgs): Promise<ListThemesResponse> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async listCampaigns(_args: ListCampaignsArgs): Promise<ListCampaignsResponse> {
        return this.unimplemented();
    }

    private async unimplemented() {
        return Promise.reject("Not implemented");
    }
}