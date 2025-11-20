import {Link as RouterLink} from "react-router";
import {Link, type LinkProps} from "@mui/joy";

export interface UserLinkProps extends LinkProps {
    userId: number;
}

export const UserLink = (
    {userId, ...rest}: UserLinkProps
) => {
    return (
        <Link
            component={RouterLink}
            to={`/app/users/${userId}`}
            underline="hover"
            color="primary"

            {...rest}
         />
    )
}