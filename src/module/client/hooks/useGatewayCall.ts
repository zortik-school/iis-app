import {useGateway} from "./useGateway.ts";
import type {GatewayService} from "../GatewayService.ts";
import {useGatewayError} from "./useGatewayError.ts";

export type UseGatewayCallProps<T> = (gateway: GatewayService) => Promise<T>;

export const useGatewayCall = () => {
    const gateway = useGateway();
    const {noteGatewayError} = useGatewayError();

    const handleFetchError = (err: Error) => {
        noteGatewayError(err);
    }

    return async <T>(fn: UseGatewayCallProps<T>): Promise<T> => {
        try {
            return await fn(gateway);
        } catch (err) {
            if (err instanceof Error) {
                handleFetchError(err);
            }

            throw err;
        }
    };
}