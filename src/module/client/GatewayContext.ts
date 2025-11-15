import {type GatewayService, UnimplementedGatewayService} from "./GatewayService.ts";
import {createContext} from "react";

export type GatewayContextData = GatewayService;

const createDefaultData = (): GatewayContextData => {
    return new UnimplementedGatewayService();
}

export const GatewayContext = createContext<GatewayContextData>(createDefaultData());