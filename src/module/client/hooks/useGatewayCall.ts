import {useGateway} from "./useGateway.ts";
import type {GatewayService} from "../GatewayService.ts";
import {useGatewayError} from "./useGatewayError.ts";
import {useCallback} from "react";

export type UseGatewayCallProps<T> = (gateway: GatewayService) => Promise<T>;

export const useGatewayCall = () => {
    const gateway = useGateway();
    const {noteGatewayError} = useGatewayError();
    
    return useCallback(async <T>(fn: UseGatewayCallProps<T>): Promise<T> => {
        try {
            return await fn(gateway);
        } catch (err) {
            if (err instanceof Error) {
                noteGatewayError(err);
            }

            throw err;
        }
    }, [gateway, noteGatewayError]);
}