import {CenteredLayout, type CenteredLayoutProps} from "./CenteredLayout.tsx";
import {Sheet, Typography} from "@mui/joy";

export interface CenteredDialogLayoutProps extends CenteredLayoutProps {
    title: string;
    subtitle: string;
}

export const CenteredDialogLayout = (
    {title, subtitle, children}: CenteredDialogLayoutProps
) => {

    return (
        <CenteredLayout>
            <Sheet
                variant="outlined"
                color="neutral"
                sx={{
                    width: 300,
                    mx: 'auto',
                    my: 4,
                    py: 3,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRadius: 'sm',
                    boxShadow: 'md',
                }}
            >
                <div>
                    <Typography level="h4" component="h1">{title}</Typography>
                    <Typography level="body-sm">{subtitle}</Typography>
                </div>

                {children}
            </Sheet>
        </CenteredLayout>
    )
}