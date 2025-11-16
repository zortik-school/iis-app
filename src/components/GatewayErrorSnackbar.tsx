import {useGatewayError} from "../module/client/hooks/useGatewayError.ts";
import {Snackbar, Typography, Box, type SnackbarProps} from "@mui/joy";
import {ErrorOutline} from "@mui/icons-material";
import {useEffect, useState} from "react";

export const GatewayErrorSnackbar = () => {
    const {lastGatewayError, getGatewayError} = useGatewayError();
    
    const [open, setOpen] = useState<boolean>(false);

    const handleClose: SnackbarProps["onClose"] = (_, reason) => {
        if (reason !== "timeout") {
            return;
        }

        setOpen(false);
    }
    
    useEffect(() => {
        if (open) {
            return;
        }
        
        (async () => {
            setOpen(getGatewayError({ ageLimit: 5000 }) !== null);
        })();
    }, [getGatewayError, lastGatewayError, open]);

    return (
        <Snackbar
            color="danger"
            variant="outlined"
            open={open}
            onClose={handleClose}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            startDecorator={<ErrorOutline />}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    px: 1,
                }}
            >
                <Typography level="body-md">
                    A gateway error has occurred.
                </Typography>
                <Typography level="body-sm" sx={{ opacity: 0.8 }}>
                    {getGatewayError()?.message}
                </Typography>
            </Box>
        </Snackbar>
    )
}