import type {PageArgs, PageResponse, QueryArgs} from "./util.ts";

export type Role = "ADMIN"
    | "CAMPAIGN_MANAGER"
    | "STEP_MANAGER"
    | "ACTIVITY_EXECUTOR"
    | "USER";

export type Privilege = "MANAGE_USERS"
    | "MANAGE_THEMES"
    | "MANAGE_CAMPAIGNS"
    | "MANAGE_STEPS"
    | "VIEW_ASSIGNED_CAMPAIGNS"
    | "VIEW_ASSIGNED_STEPS"
    | "VIEW_ASSIGNED_ACTIVITIES"
    | "VIEW_AVAILABLE_ACTIVITIES";

export interface User {
    id: number;
    username: string;
    name: string;
    role: Role;
}

export interface IdentityUser extends User {
    privileges: Privilege[];
}

export type IdentityUserResponse = IdentityUser;

export interface ListUsersArgs extends PageArgs {
    activityId?: number;
    campaignId?: number;
}

export type ListUsersResponse = PageResponse<User>;

export type DeleteUserArgs = {
    userId: number;
}

export type ChangeRoleArgs = {
    userId: number;
    role: Role;
}

export type QueryUsersArgs = QueryArgs;

export type QueryUsersResponse = PageResponse<User>;

export type GetUserArgs = {
    userId: number;
}

export type GetUserResponse = User;

export interface ChangeOwnPasswordArgs {
    oldPassword: string;
    newPassword: string;
}