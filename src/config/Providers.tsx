import type {PropsWithChildren} from "react";
import {GatewayProvider} from "../module/client/GatewayProvider.tsx";
import {AuthProvider} from "../module/auth/AuthProvider.tsx";

export const Providers = (
    {children}: PropsWithChildren
) => {
    return (
        <GatewayProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </GatewayProvider>
    )
}