import {useContext} from "react";
import {GatewayErrorContext} from "../error/GatewayErrorContext.ts";

export const useGatewayError = () => {
    return useContext(GatewayErrorContext);
}