import type {PageArgs, PageResponse} from "./util.ts";

export type Role = "ADMIN"
    | "USER";

export type Privilege = "MANAGE_USERS"
    | "MANAGE_THEMES";

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

export type ListUsersArgs = PageArgs;

export type ListUsersResponse = PageResponse<User>;

export type DeleteUserArgs = {
    userId: number;
}

export type ChangeRoleArgs = {
    userId: number;
    role: Role;
}