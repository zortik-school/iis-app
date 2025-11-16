import type {Privilege} from "../module/client/model/user.ts";
import {useAuth} from "../module/auth/hooks/useAuth.ts";
import {Navigate, Outlet} from "react-router-dom";

export interface PrivilegedPageProps {
    privilege: Privilege | Privilege[];
}

export const PrivilegedPage = (
    {privilege}: PrivilegedPageProps
) => {
    const {user} = useAuth();

    if (!user ||
        (Array.isArray(privilege) ? privilege : [privilege])
            .some(p => !user.privileges.includes(p))) {
        // Not authorized
        return <Navigate to="/app" />;
    }

    return <Outlet />;
}