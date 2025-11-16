import {type PropsWithChildren, useState} from "react";
import {GatewayContext} from "./GatewayContext.ts";
import {createDefaultGatewayService, type GatewayService} from "./GatewayService.ts";
import {GatewayErrorProvider} from "./error/GatewayErrorProvider.tsx";

export type GatewayProviderProps = PropsWithChildren;

export const GatewayProvider = (
    {children}: GatewayProviderProps
) => {
    const [gateway] = useState<GatewayService>(createDefaultGatewayService(import.meta.env.VITE_API_BASE_URL));

    return (
        <GatewayContext.Provider value={gateway}>
            <GatewayErrorProvider>
                {children}
            </GatewayErrorProvider>
        </GatewayContext.Provider>
    )
}