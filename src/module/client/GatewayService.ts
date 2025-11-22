import type {
    JwtResponse,
    LoginArgs,
    LoginResponse,
    RefreshResponse,
    RegisterArgs, RegisterResponse
} from "./model/auth.ts";
import type {
    ChangeOwnPasswordArgs,
    ChangeRoleArgs,
    DeleteUserArgs, GetUserArgs, GetUserResponse,
    IdentityUserResponse,
    ListUsersArgs,
    ListUsersResponse, QueryUsersArgs, QueryUsersResponse
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
import type {
    AddUserToCampaignArgs,
    AssignUserToCampaignArgs,
    CreateCampaignArgs, CreateCampaignResponse,
    DeleteCampaignArgs, InspectCampaignArgs, InspectCampaignResponse,
    ListCampaignsArgs,
    ListCampaignsResponse, RemoveUserFromCampaignArgs
} from "./model/campaign.ts";
import type {
    ActivateCampaignStepArgs,
    AddCampaignStepArgs, AddCampaignStepResponse, AssignUserToCampaignStepArgs,
    GetCampaignStepsForCampaignArgs,
    GetCampaignStepsForCampaignResponse, InspectCampaignStepArgs,
    InspectCampaignStepResponse, ListCampaignStepsArgs, ListCampaignStepsResponse
} from "./model/step.ts";

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
     * Get a user.
     *
     * @param args The args
     */
    getUser(args: GetUserArgs): Promise<GetUserResponse>;

    /**
     * Change a user's role.
     *
     * @param args The args
     */
    changeUserRole(args: ChangeRoleArgs): Promise<unknown>;

    /**
     * Change own password.
     *
     * @param args The args
     */
    changeOwnPassword(args: ChangeOwnPasswordArgs): Promise<unknown>;

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
     * Create a campaign.
     *
     * @param args The args
     */
    createCampaign(args: CreateCampaignArgs): Promise<CreateCampaignResponse>;

    /**
     * Delete a campaign.
     *
     * @param args The args
     */
    deleteCampaign(args: DeleteCampaignArgs): Promise<unknown>;

    /**
     * Inspect a campaign.
     *
     * @param args The args
     */
    inspectCampaign(args: InspectCampaignArgs): Promise<InspectCampaignResponse>;

    /**
     * Assign a user to a campaign.
     *
     * @param args The args
     */
    assignUserToCampaign(args: AssignUserToCampaignArgs): Promise<unknown>;

    /**
     * Add a user to a campaign.
     *
     * @param args The args
     */
    addUserToCampaign(args: AddUserToCampaignArgs): Promise<unknown>;

    /**
     * Remove a user from a campaign.
     *
     * @param args The args
     */
    removeUserFromCampaign(args: RemoveUserFromCampaignArgs): Promise<unknown>;

    /**
     * List campaigns.
     *
     * @param args The args
     */
    listCampaigns(args: ListCampaignsArgs): Promise<ListCampaignsResponse>;

    /**
     * Get campaign steps for a campaign.
     *
     * @param args The args
     */
    getCampaignStepsForCampaign(args: GetCampaignStepsForCampaignArgs): Promise<GetCampaignStepsForCampaignResponse>;

    /**
     * Add a campaign step to a campaign.
     *
     * @param args The args
     */
    addCampaignStep(args: AddCampaignStepArgs): Promise<AddCampaignStepResponse>;

    /**
     * Activate a campaign step.
     *
     * @param args The args
     */
    activateCampaignStep(args: ActivateCampaignStepArgs): Promise<unknown>;

    /**
     * Inspect a campaign step.
     *
     * @param args The args
     */
    inspectCampaignStep(args: InspectCampaignStepArgs): Promise<InspectCampaignStepResponse>;

    /**
     * Assign a user to a campaign step.
     *
     * @param args The args
     */
    assignUserToCampaignStep(args: AssignUserToCampaignStepArgs): Promise<unknown>;

    /**
     * List campaign steps.
     *
     * @param args The args
     */
    listCampaignSteps(args: ListCampaignStepsArgs): Promise<ListCampaignStepsResponse>;

    /**
     * Query users.
     *
     * @param args The args
     */
    queryUsers(args: QueryUsersArgs): Promise<QueryUsersResponse>;
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
        const params = this.buildPageParams(args, {
            ...(args.activityId !== undefined ? {activityId: args.activityId} : {}),
            ...(args.campaignId !== undefined ? {campaignId: args.campaignId} : {}),
        });

        return this.internalFetch<ListUsersResponse>(`/users?${params}`);
    }

    async deleteUser(args: DeleteUserArgs): Promise<unknown> {
        return this.internalFetch<unknown>("/users/" + args.userId, {
            method: "DELETE",
        });
    }

    async getUser(args: GetUserArgs): Promise<GetUserResponse> {
        return this.internalFetch<GetUserResponse>(`/users/${args.userId}`);
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

    async changeOwnPassword(args: ChangeOwnPasswordArgs): Promise<unknown> {
        const body = {
            oldPassword: args.oldPassword,
            newPassword: args.newPassword,
        }

        return this.internalFetch<unknown>(`/users/me/password`, {
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

    async createCampaign(args: CreateCampaignArgs): Promise<CreateCampaignResponse> {
        const body = {
            name: args.name,
            themeId: args.themeId,
        }

        return this.internalFetch<CreateCampaignResponse>(`/campaigns`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    async deleteCampaign(args: DeleteCampaignArgs): Promise<unknown> {
        return this.internalFetch<unknown>(`/campaigns/${args.campaignId}`, {
            method: "DELETE",
        });
    }

    async inspectCampaign(args: InspectCampaignArgs): Promise<InspectCampaignResponse> {
        return this.internalFetch<InspectCampaignResponse>(`/campaigns/${args.campaignId}/inspect`);
    }

    async assignUserToCampaign(args: AssignUserToCampaignArgs): Promise<unknown> {
        const body = {
            userId: args.userId,
        }

        return this.internalFetch<unknown>(`/campaigns/${args.campaignId}/assign`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    async addUserToCampaign(args: AddUserToCampaignArgs): Promise<unknown> {
        const body = {
            userId: args.userId,
        }

        return this.internalFetch<unknown>(`/campaigns/${args.campaignId}/adduser`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    async removeUserFromCampaign(args: RemoveUserFromCampaignArgs): Promise<unknown> {
        const body = {
            userId: args.userId,
        }

        return this.internalFetch<unknown>(`/campaigns/${args.campaignId}/removeuser`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    async getCampaignStepsForCampaign(args: GetCampaignStepsForCampaignArgs): Promise<GetCampaignStepsForCampaignResponse> {
        return this.internalFetch<GetCampaignStepsForCampaignResponse>(`/campaigns/${args.campaignId}/steps`);
    }

    async addCampaignStep(args: AddCampaignStepArgs): Promise<AddCampaignStepResponse> {
        const body = {
            name: args.name,
            campaignId: args.campaignId,
        }

        return this.internalFetch<AddCampaignStepResponse>(`/steps`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    async activateCampaignStep(args: ActivateCampaignStepArgs): Promise<unknown> {
        return this.internalFetch<unknown>(`/steps/${args.stepId}/activate`, {
            method: "POST",
        });
    }

    async inspectCampaignStep(args: InspectCampaignStepArgs): Promise<InspectCampaignStepResponse> {
        return this.internalFetch<InspectCampaignStepResponse>(`/steps/${args.stepId}/inspect`);
    }

    async assignUserToCampaignStep(args: AssignUserToCampaignStepArgs): Promise<unknown> {
        const body = {
            userId: args.userId,
        }

        return this.internalFetch<unknown>(`/steps/${args.stepId}/assign`, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    async listCampaignSteps(args: ListCampaignStepsArgs): Promise<ListCampaignStepsResponse> {
        const params = this.buildPageParams(args, {
            ...args.assigned !== undefined ? {assigned: args.assigned} : {},
        });

        return this.internalFetch<ListCampaignStepsResponse>(`/steps?${params}`);
    }

    async queryUsers(args: QueryUsersArgs): Promise<QueryUsersResponse> {
        const params = this.buildPageParams(args, {
            query: args.query,
        });

        return this.internalFetch<QueryUsersResponse>(`/query/users?${params}`);
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
    async getUser(_args: GetUserArgs): Promise<GetUserResponse> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async changeUserRole(_args: ChangeRoleArgs): Promise<unknown> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async changeOwnPassword(_args: ChangeOwnPasswordArgs): Promise<unknown> {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async createCampaign(_args: CreateCampaignArgs): Promise<CreateCampaignResponse> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async deleteCampaign(_args: DeleteCampaignArgs): Promise<unknown> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async inspectCampaign(_args: InspectCampaignArgs): Promise<InspectCampaignResponse> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async assignUserToCampaign(_args: AssignUserToCampaignArgs): Promise<unknown> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async addUserToCampaign(_args: AddUserToCampaignArgs): Promise<unknown> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async removeUserFromCampaign(_args: RemoveUserFromCampaignArgs): Promise<unknown> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getCampaignStepsForCampaign(_args: GetCampaignStepsForCampaignArgs): Promise<GetCampaignStepsForCampaignResponse> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async addCampaignStep(_args: AddCampaignStepArgs): Promise<AddCampaignStepResponse> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async activateCampaignStep(_args: ActivateCampaignStepArgs): Promise<unknown> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async inspectCampaignStep(_args: InspectCampaignStepArgs): Promise<InspectCampaignStepResponse> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async assignUserToCampaignStep(_args: AssignUserToCampaignStepArgs): Promise<unknown> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async listCampaignSteps(_args: ListCampaignStepsArgs): Promise<ListCampaignStepsResponse> {
        return this.unimplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async queryUsers(_args: QueryUsersArgs): Promise<QueryUsersResponse> {
        return this.unimplemented();
    }

    private async unimplemented() {
        return Promise.reject("Not implemented");
    }
}