import {CircularProgress, type CircularProgressProps} from "@mui/joy";

export const Spinner = (
    {sx, ...rest}: CircularProgressProps
) => {
    return (
        <CircularProgress size="sm" sx={{ bgcolor: 'background.surface', ...sx }} {...rest} />
    )
}