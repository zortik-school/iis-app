import {useContext} from "react";
import {AuthContext} from "../AuthContext.ts";

export const useAuth = () => {
    return useContext(AuthContext);
}