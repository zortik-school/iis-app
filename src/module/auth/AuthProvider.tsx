import {AuthContext, type AuthContextData} from "./AuthContext.ts";
import {type PropsWithChildren, useEffect, useState} from "react";
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
    const [err, setErr] = useState<Error>();

    useEffect(() => {
        gateway.refresh()
            .then((data) => setToken(data.token))
            .catch((err) => setErr(err));
    }, [gateway]);

    useEffect(() => {
        if (token.length == 0) {
            return;
        }

        gateway.getIdentity()
            .then((res) => setIdentity(res))
            .finally(() => setReady(true));
    }, [gateway, token]);

    const data: AuthContextData = {
        user: identity,
        ready,
        error: err,
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}