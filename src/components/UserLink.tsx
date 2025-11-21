import {Link as RouterLink} from "react-router";
import {Link, type LinkProps} from "@mui/joy";
import {type ReactNode, useEffect, useState} from "react";
import type {User} from "../module/client/model/user.ts";
import {useGatewayCall} from "../module/client/hooks/useGatewayCall.ts";

export interface UserLinkProps extends LinkProps {
    userId: number;
    children?: ReactNode;
}

export const UserLink = (
    {userId, children, ...rest}: UserLinkProps
) => {
    const gatewayCall = useGatewayCall();

    const [user, setUser] = useState<User | null>(null);
    const [fetching, setFetching] = useState<boolean>(true);

    useEffect(() => {
        gatewayCall((gateway) => gateway.getUser({ userId }))
            .then((fetchedUser) => setUser(fetchedUser))
            .finally(() => setFetching(false));
    }, [gatewayCall, userId]);

    return (
        <Link
            component={RouterLink}
            to={`/app/users/${userId}`}
            underline="hover"
            color="primary"

            {...rest}
         >
            {children ?? (
                fetching ? "..." : user?.name
            )}
        </Link>
    )
}