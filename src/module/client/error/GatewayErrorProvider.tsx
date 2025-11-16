import {GatewayErrorContext, type GatewayErrorContextData} from "./GatewayErrorContext.ts";
import {type PropsWithChildren, useState} from "react";

export type GatewayErrorProviderProps = PropsWithChildren;

export const GatewayErrorProvider = (
    {children}: GatewayErrorProviderProps
) => {
    const [lastGatewayError, setLastGatewayError] = useState<Error | null>(null);
    const [lastGatewayErrorMillis, setLastGatewayErrorMillis] = useState<number>(0);

    const data: GatewayErrorContextData = {
        lastGatewayError,
        lastGatewayErrorMillis,

        noteGatewayError: (err) => {
            setLastGatewayError(err);
            setLastGatewayErrorMillis(Date.now());
        },

        getGatewayError: (args) => {
            if (!args?.ageLimit) {
                return lastGatewayError;
            }

            if ((Date.now() - lastGatewayErrorMillis) <= args.ageLimit) {
                return lastGatewayError;
            } else {
                return null;
            }
        }
    }
    return (
        <GatewayErrorContext.Provider value={data}>
            {children}
        </GatewayErrorContext.Provider>
    )
}