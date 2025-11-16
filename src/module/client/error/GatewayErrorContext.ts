import {createContext} from "react";

export interface GetGatewayErrorArgs {
    /**
     * The age limit (in milliseconds) for the error to be considered relevant.
     */
    ageLimit?: number;
}

export interface GatewayErrorContextData {
    /**
     * The last error that occurred when communicating with the gateway.
     */
    lastGatewayError: Error | null;
    /**
     * The timestamp (in milliseconds since epoch) of the last error.
     */
    lastGatewayErrorMillis: number;

    /**
     * Notes an error that occurred when communicating with the gateway.
     *
     * @param error The error that occurred.
     */
    noteGatewayError: (error: Error) => void;

    /**
     * Gets the relevant gateway error.
     *
     * @param args The arguments for getting the gateway error.
     * @returns The last gateway error or null if none
     */
    getGatewayError: (args?: GetGatewayErrorArgs) => Error | null;
}

const createDefaultContextData = (): GatewayErrorContextData => {
    return {
        lastGatewayError: null,
        lastGatewayErrorMillis: 0,

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        noteGatewayError: (_error: Error) => {
            throw new Error("Not implemented");
        },

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getGatewayError: (_args?: GetGatewayErrorArgs): Error | null => {
            throw new Error("Not implemented");
        }
    }
}

export const GatewayErrorContext = createContext<GatewayErrorContextData>(createDefaultContextData());