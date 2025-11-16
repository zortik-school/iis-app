import type {PropsWithChildren} from "react";
import {GatewayProvider} from "../module/client/GatewayProvider.tsx";
import {AuthProvider} from "../module/auth/AuthProvider.tsx";
import {NotificationProvider} from "../components/notification/NotificationProvider.tsx";

export const Providers = (
    {children}: PropsWithChildren
) => {
    return (
        <GatewayProvider>
            <AuthProvider>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </AuthProvider>
        </GatewayProvider>
    )
}