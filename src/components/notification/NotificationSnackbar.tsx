import {Snackbar, type SnackbarProps} from "@mui/joy";
import {ErrorOutline} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {useNotification} from "../../hooks/useNotification.ts";

export const NotificationSnackbar = () => {
    const {notification, setNotification} = useNotification();
    const [open, setOpen] = useState<boolean>(false);

    const handleClose: SnackbarProps["onClose"] = (_, reason) => {
        if (reason !== "timeout") {
            return;
        }

        setOpen(false);
        setNotification(undefined);
    }

    useEffect(() => {
        (async () => {
            setOpen(notification !== undefined);
        })();
    }, [notification]);

    return (
        <Snackbar
            color="primary"
            variant="outlined"
            open={open}
            onClose={handleClose}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            startDecorator={<ErrorOutline />}
        >
            {notification}
        </Snackbar>
    )
}