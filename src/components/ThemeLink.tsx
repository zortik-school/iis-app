import {Link, type LinkProps} from "@mui/joy";
import {Link as RouterLink} from "react-router";

export interface ThemeLinkProps extends LinkProps {
    themeId: number;
}

export const ThemeLink = (
    {themeId, ...rest}: ThemeLinkProps
) => {
    return (
        <Link
            component={RouterLink}
            to={`/app/themes/${themeId}/edit`}
            underline="hover"
            color="primary"

            {...rest}
        />
    )
}