import {Fragment, type PropsWithChildren} from "react";
import type {Privilege} from "../../module/client/model/user.ts";
import {useAuth} from "../../module/auth/hooks/useAuth.ts";

export interface RestrictedByPrivilegeProps extends PropsWithChildren {
    privilege: Privilege | Privilege[];
}

export const RestrictedByPrivilege = (
    {privilege, children}: RestrictedByPrivilegeProps
) => {
    const {user} = useAuth();

    if (!user) {
        // Not even authenticated
        return null;
    }

    const has = Array.isArray(privilege)
        ? privilege.some((p) => user.privileges.includes(p))
        : user.privileges.includes(privilege);

    return has ? <Fragment>{children}</Fragment> : null;
}