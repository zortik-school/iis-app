import {useNavigate, useParams} from "react-router-dom";
import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {useGateway} from "../../module/client/hooks/useGateway.ts";
import useSWR from "swr";
import {LoadingPage} from "../LoadingPage.tsx";
import {ExpectSWRErrors} from "../../components/ExpectSWRErrors.tsx";
import {ActivityViewBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {
    Typography,
    Card,
    Stack,
    FormControl,
    FormLabel,
    Textarea,
    Button,
    Divider,
} from "@mui/joy";
import {type SubmitHandler, useForm} from "react-hook-form";

type CloseActivityFormInputs = {
    outcomeNotes: string;
}

export const ActivityViewPage = () => {
    const {activityId} = useParams<{ activityId: string }>();
    const gateway = useGateway();

    const navigate = useNavigate();

    const {register, handleSubmit} = useForm<CloseActivityFormInputs>();

    const {data, error, isLoading} = useSWR(
        `activity-${activityId}`,
        () => gateway.getActivity({ activityId: Number(activityId) })
    );

    const handleCloseSubmit: SubmitHandler<CloseActivityFormInputs> = (formData) => {
        gateway.closeActivity({
            activityId: Number(activityId),
            note: {
                content: formData.outcomeNotes,
            }
        })
            .then(() => navigate("/app/activities/browser"));
    }

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <ExpectSWRErrors errors={[error]}>
            {data && (
                <MainLayout title={data.name} breadcrumbNodes={ActivityViewBreadcrumbNodes}>
                    <Stack spacing={3}>

                        <Typography level="h2" fontSize="lg" fontWeight="lg">
                            Activity Description
                        </Typography>
                        <Typography level="body-sm">
                            {data.description}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Card variant="soft">
                            <Typography level="h2" fontSize="lg" fontWeight="lg">
                                Close Activity
                            </Typography>

                            <form onSubmit={handleSubmit(handleCloseSubmit)} className="flex flex-col gap-4 mt-2">
                                <FormControl>
                                    <FormLabel>Outcome Notes</FormLabel>
                                    <Textarea
                                        minRows={4}
                                        placeholder="Describe the results, outcomes or notes for closing this activity..."

                                        {...register("outcomeNotes")}

                                        required
                                    />
                                </FormControl>

                                <Button
                                    variant="solid"
                                    color="primary"
                                    size="lg"
                                    type="submit"
                                >
                                    Submit & Close Activity
                                </Button>
                            </form>
                        </Card>
                    </Stack>

                </MainLayout>
            )}
        </ExpectSWRErrors>
    );
};