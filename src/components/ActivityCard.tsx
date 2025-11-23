import {
    Card,
    CardContent,
    Typography,
    Divider,
    Stack,
    Button
} from "@mui/joy";
import type { Activity } from "../module/client/model/activity.ts";
import {ActivityStateBadge} from "./ActivityStateBadge.tsx";
import {useNavigate} from "react-router-dom";

export interface ActivityCardProps {
    activity: Activity;
    readOnly?: boolean;
}

export const ActivityCard = ({
                                 activity,
                                 readOnly = false
                             }: ActivityCardProps) => {
    const navigate = useNavigate();

    return (
        <Card variant="soft" sx={{ borderRadius: "lg", boxShadow: "sm" }}>
            <CardContent>
                <Typography level="title-md">
                    {activity.name}
                </Typography>

                <Typography level="body-sm" sx={{ mt: 0.5, color: "text.secondary" }}>
                    {activity.description || "No description provided."}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    {activity.state && (
                        <ActivityStateBadge state={activity.state} />
                    )}
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                    Created at: {new Date().toLocaleDateString()}
                </Typography>
                {readOnly ? null : (
                    <Button
                        sx={{
                            mt: 2,
                        }}
                        onClick={() => navigate("/app/activities/" + activity.id)}
                    >
                        View Activity
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};