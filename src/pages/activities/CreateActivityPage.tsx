import {FormControl, FormLabel, Input, Button, Box} from "@mui/joy";
import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {CreateActivityBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {type SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";

type FormInputs = {
    activityName: string;
    activityDescription: string;
    // activityStartDate: number;
    // activityEndDate: number;
}

export const CreateActivityPage = () => {
    const { stepId } = useParams<{ stepId: string }>();

    const callGateway = useGatewayCall();
    const navigate = useNavigate();

    const {handleSubmit, register} = useForm<FormInputs>();
    const [controlsDisabled, setControlsDisabled] = useState<boolean>(false);

    const onSubmitValid: SubmitHandler<FormInputs> = (data) => {
        setControlsDisabled(true);

        callGateway((gateway) => {
            return gateway.createActivity({
                stepId: Number(stepId),
                name: data.activityName,
                description: data.activityDescription,
                //startDate: data.activityStartDate,
                //endDate: data.activityEndDate,
                startDate: Date.now(),
                endDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // +7 days
            });
        }).then((activity) => {
            navigate("/app/steps/" + activity.stepId + "/edit");
        }).finally(() => {
            setControlsDisabled(false);
        });
    }

    return (
        <MainLayout title="Create Activity" breadcrumbNodes={CreateActivityBreadcrumbNodes}>
            <form
                onSubmit={handleSubmit(onSubmitValid)}
                className="flex flex-col"
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel>Activity name</FormLabel>
                        <Input
                            type="text"
                            placeholder="Gorgeous activity" required {...register("activityName")} />
                    </FormControl>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel>Activity description</FormLabel>
                        <Input
                            type="text"
                            placeholder="What should we call our activity.." required {...register("activityDescription")} />
                    </FormControl>
                </Box>

                {/* TODO dates */}

                <Button
                    type="submit"
                    sx={{ mt: 1 }}
                    disabled={controlsDisabled}
                    loading={controlsDisabled}
                >Create</Button>
            </form>
        </MainLayout>
    )
}