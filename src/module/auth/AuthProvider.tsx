import {AuthContext, type AuthContextData, type ContextLoginArgs, type ContextRegisterArgs} from "./AuthContext.ts";
import {type PropsWithChildren, useCallback, useEffect, useState} from "react";
import {useGateway} from "../client/hooks/useGateway.ts";
import type {IdentityUser} from "../client/model/user.ts";

export type AuthProviderProps = PropsWithChildren;

export const AuthProvider = (
    {children}: AuthProviderProps
) => {
    const gateway = useGateway();

    const [token, setToken] = useState<string>("");
    const [identity, setIdentity] = useState<IdentityUser|undefined>(undefined);

    const [ready, setReady] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const [err, setErr] = useState<Error>();

    useEffect(() => {
        gateway.refresh()
            .then((data) => setToken(data.token))
            .catch(() => {
                setReady(true);
            });
    }, [gateway]);

    useEffect(() => {
        if (token.length == 0) {
            return;
        }

        gateway.getIdentity()
            .then((res) => setIdentity(res))
            .finally(() => setReady(true));
    }, [gateway, token]);

    const performAuthOperation = useCallback(async (op: () => Promise<void>) => {
        if (pending) {
            return;
        }

        setPending(true);
        setErr(undefined);

        try {
            await op();
        } catch (e) {
            setErr(e as Error);
        } finally {
            setPending(false);
        }
    }, [pending]);

    const data: AuthContextData = {
        user: identity,
        ready,
        pendingOperation: pending,
        error: err,

        login: async (args: ContextLoginArgs) => {
            return performAuthOperation(async () => {
                const res = await gateway.login({
                    username: args.username,
                    password: args.password,
                });

                setToken(res.token);
            });
        },

        register: async (args: ContextRegisterArgs) => {
            return performAuthOperation(async () => {
                const res = await gateway.register({
                    username: args.username,
                    password: args.password,
                    name: args.name,
                });

                setToken(res.token);
            });
        },

        logout: async () => {
            return performAuthOperation(async () => {
                try {
                    await gateway.logout();
                } finally {
                    setToken("");
                    setIdentity(undefined);
                }
            });
        },
    };
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}