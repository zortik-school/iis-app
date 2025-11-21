import {Link, type LinkProps} from "@mui/joy";
import {Link as RouterLink} from "react-router";

export interface StepLinkProps extends LinkProps {
    stepId: number;
}

export const StepLink = (
    {stepId, ...rest}: StepLinkProps
) => {
    return (
        <Link
            component={RouterLink}
            to={`/app/steps/${stepId}/edit`}
            underline="hover"
            color="primary"

            {...rest}
        />
    )
}