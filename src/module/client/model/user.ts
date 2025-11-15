export type Role = "ADMIN" | "USER";

export type Privilege = "MANAGE_USERS";

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