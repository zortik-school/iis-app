import {createContext} from "react";
import type {IdentityUser} from "../client/model/user.ts";

export type ContextLoginArgs = {
    username: string;
    password: string;
}

export type ContextRegisterArgs = {
    username: string;
    password: string;
    name: string;
}

export interface AuthContextData {
    user?: IdentityUser;
    ready: boolean;
    /**
     * Indicates whether there is a pending authentication-related operation.
     */
    pendingOperation: boolean;
    error?: Error;
    /**
     * Performs login operation.
     *
     * @param args Login arguments.
     */
    login: (args: ContextLoginArgs) => Promise<void>,
    /**
     * Performs registration operation.
     *
     * @param args Registration arguments.
     */
    register: (args: ContextRegisterArgs) => Promise<void>,
    /**
     * Performs logout operation.
     */
    logout: () => Promise<void>,
}

const createDefaultContext = (): AuthContextData => {
    return {
        ready: false,
        pendingOperation: false,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        login: async (_args: ContextLoginArgs) => {
            throw new Error("Not implemented");
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        register: async (_args: ContextRegisterArgs) => {
            throw new Error("Not implemented");
        },
        logout: async () => {
            throw new Error("Not implemented");
        }
    };
}

export const AuthContext = createContext<AuthContextData>(createDefaultContext());