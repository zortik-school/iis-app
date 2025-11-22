import {
    Card,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Divider,
    Chip,
    Stack,
} from "@mui/joy";
import { Delete, Edit } from "@mui/icons-material";
import type { Activity } from "../module/client/model/activity.ts";
import {type Question, useConfirmModal} from "./modal/ConfirmModalContext.tsx";
import {useGatewayCall} from "../module/client/hooks/useGatewayCall.ts";

export interface ActivityCardProps {
    activity: Activity;
    privileged: boolean;
    setIntegrityKey: (key: number) => void;
}

export const ActivityCard = ({
                                 activity,
                                 privileged,
                                 setIntegrityKey
                             }: ActivityCardProps) => {
    const gatewayCall = useGatewayCall();
    const {setQuestion} = useConfirmModal();

    const handleDelete = (id: number) => {
        const question: Question = {
            title: "Delete Activity?",
            message:
                "Are you sure you want to delete this activity? This action cannot be undone.",
            onConfirm: () => {
                gatewayCall((gateway) =>
                    gateway.deleteActivity({ activityId: id })
                )
                    .then(() => setIntegrityKey(Date.now()));
            },
        };

        setQuestion(question);
    };

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
                        <Chip size="sm" variant="soft" color="primary">
                            {activity.state}
                        </Chip>
                    )}
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                    Created at: {new Date().toLocaleDateString()}
                </Typography>
            </CardContent>

            {privileged && (
                <CardActions>
                    <IconButton variant="plain" color="neutral">
                        <Edit />
                    </IconButton>
                    <IconButton
                        variant="soft"
                        color="danger"
                        onClick={() => handleDelete(activity.id)}
                    >
                        <Delete />
                    </IconButton>
                </CardActions>
            )}
        </Card>
    );
};