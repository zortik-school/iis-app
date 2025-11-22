import {FormControl, FormLabel, Input, Button, Box} from "@mui/joy";
import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {CreateCampaignBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {type SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";

type FormInputs = {
    campaignName: string;
}

export const CreateCampaignPage = () => {
    const { themeId } = useParams<{ themeId: string }>();

    const callGateway = useGatewayCall();
    const navigate = useNavigate();

    const {handleSubmit, register} = useForm<FormInputs>();
    const [controlsDisabled, setControlsDisabled] = useState<boolean>(false);

    const onSubmitValid: SubmitHandler<FormInputs> = (data) => {
        setControlsDisabled(true);

        callGateway((gateway) => {
            return gateway.createCampaign({
                themeId: Number(themeId),
                name: data.campaignName,
            });
        }).then((campaign) => {
            navigate("/app/campaigns/" + campaign.id + "/edit");
        }).finally(() => {
            setControlsDisabled(false);
        });
    }

    return (
        <MainLayout title="Create Campaign" breadcrumbNodes={CreateCampaignBreadcrumbNodes}>
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
                        <FormLabel>Campaign name</FormLabel>
                        <Input
                            type="text"
                            placeholder="Gorgeous campaign" required {...register("campaignName")} />
                    </FormControl>
                </Box>

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