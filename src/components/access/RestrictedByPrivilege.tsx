import type {PropsWithChildren} from "react";
import type {Privilege} from "../../module/client/model/user.ts";
import {useAuth} from "../../module/auth/hooks/useAuth.ts";

export interface RestrictedByPrivilegeProps extends PropsWithChildren {
    privilege: Privilege;
}

export const RestrictedByPrivilege = (
    {privilege, children}: RestrictedByPrivilegeProps
) => {
    const {user} = useAuth();

    if (!user) {
        // Not event authenticated
        return null;
    }

    return user.privileges.includes(privilege) ? <>{children}</> : null;
}