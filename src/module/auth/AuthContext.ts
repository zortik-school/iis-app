import {createContext} from "react";
import type {IdentityUser} from "../client/model/user.ts";

export interface AuthContextData {
    user?: IdentityUser;
    ready: boolean;
    error?: Error;
}

const createDefaultContext = (): AuthContextData => {
    return {
        ready: false,
    };
}

export const AuthContext = createContext<AuthContextData>(createDefaultContext());