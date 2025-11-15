import {useContext} from "react";
import {GatewayContext} from "../GatewayContext.ts";

export const useGateway = () => {
    return useContext(GatewayContext);
}