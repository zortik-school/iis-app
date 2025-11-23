import {Link, type LinkProps} from "@mui/joy";
import {Link as RouterLink} from "react-router-dom";

export type AppLinkProps = LinkProps<typeof RouterLink>

export const AppLink = (
    props: AppLinkProps
) => {
    return (
        <Link component={RouterLink} {...props} />
    )
}