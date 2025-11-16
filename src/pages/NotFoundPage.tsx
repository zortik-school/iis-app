import {CenteredLayout} from "../components/layouts/CenteredLayout.tsx";
import {Typography, Button, Card} from "@mui/joy";
import {useNavigate} from "react-router-dom";

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <CenteredLayout>
            <Card
                sx={{
                    px: 4,
                    py: 3,
                }}
            >
                <Typography level="body-md">404 - Page Not Found</Typography>

                <Button variant="outlined" color="neutral" onClick={() => navigate(-1)}>Go Back</Button>
            </Card>
        </CenteredLayout>
    )
}