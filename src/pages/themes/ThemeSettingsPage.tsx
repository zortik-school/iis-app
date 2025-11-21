import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {ThemeEditBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import useSWR from "swr";
import {useGateway} from "../../module/client/hooks/useGateway.ts";
import {ExpectSWRErrors} from "../../components/ExpectSWRErrors.tsx";
import {LoadingPage} from "../LoadingPage.tsx";
import {
    Tab,
    Tabs,
    tabClasses,
    TabList,
    TabPanel,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    FormControl, FormLabel, Input
} from "@mui/joy";
import type {InspectThemeResponse} from "../../module/client/model/theme.ts";
import {type SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";
import {useNotification} from "../../hooks/useNotification.ts";
import {CampaignsTable} from "../../components/table/CampaignsTable.tsx";

type ThemeEditInputs = {
    themeName: string;
    themeDescription: string;
}

const ThemeEditForm = (
    {data, onUpdate}: {
        data: InspectThemeResponse,
        onUpdate: () => void
    }
) => {
    const callGateway = useGatewayCall();
    const {handleSubmit, register} = useForm<ThemeEditInputs>();
    const {setNotification} = useNotification();

    const [controlsDisabled, setControlsDisabled] = useState<boolean>(false);

    const onSubmitValid: SubmitHandler<ThemeEditInputs> = (inputs) => {
        setControlsDisabled(true);

        callGateway((gateway) => {
            return gateway.updateTheme({
                themeId: data.id,
                name: inputs.themeName,
                description: inputs.themeDescription
            })
        })
            .then(() => {
                setNotification("Theme details updated successfully.");

                onUpdate();
            })
            .finally(() => setControlsDisabled(false));
    }

    return (
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
                    <FormLabel>Theme name</FormLabel>
                    <Input
                        type="text"
                        placeholder="Gorgeous theme" required {...register("themeName")}
                        defaultValue={data.name}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Theme description</FormLabel>
                    <Input
                        type="text"
                        placeholder="A really gorgeous theme" required {...register("themeDescription")}
                        defaultValue={data.description}
                    />
                </FormControl>
            </Box>

            <Button
                type="submit"
                color="primary"
                sx={{ mt: 1 }}
                disabled={controlsDisabled}
                loading={controlsDisabled}
            >Edit Details</Button>
        </form>
    )
}

export const ThemeSettingsPage = () => {
    const {themeId} = useParams<{ themeId: string }>();

    const gateway = useGateway();
    const navigate = useNavigate();

    const {data, error, isLoading, mutate} = useSWR("theme", () => gateway.inspectTheme({ themeId: Number(themeId) }));

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <ExpectSWRErrors errors={[error]}>
            {data && (
                <MainLayout
                    title={data.name}
                    breadcrumbNodes={ThemeEditBreadcrumbNodes}
                >
                    <Tabs
                        aria-label="tabs"
                        defaultValue={0}
                        sx={{
                            bgcolor: 'transparent'
                        }}
                    >
                        <TabList
                            disableUnderline
                            sx={{
                                p: 0.5,
                                gap: 0.5,
                                borderRadius: 'lg',
                                bgcolor: 'background.level1',
                                [`& .${tabClasses.root}[aria-selected="true"]`]: {
                                    bgcolor: 'background.surface',
                                },
                                maxWidth: "fit-content"
                            }}
                        >
                            <Tab disableIndicator>Info</Tab>
                            <Tab disableIndicator>Campaigns</Tab>
                            <Tab disableIndicator>Settings</Tab>
                        </TabList>
                        <TabPanel value={0}>
                            <Card variant="plain">
                                <CardContent>
                                    <Typography level="title-lg">Description</Typography>
                                    <Typography>{data?.description}</Typography>
                                </CardContent>
                            </Card>
                        </TabPanel>
                        <TabPanel value={1}>
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    mb: 2,
                                }}
                            >
                                <Button onClick={() => navigate(`/app/themes/${themeId}/createcampaign`)}>Add Campaign</Button>
                            </Box>
                            <CampaignsTable themeId={Number(themeId)} />
                        </TabPanel>
                        <TabPanel value={2} sx={{ px: 0 }}>
                            <Card variant="plain">
                                <CardContent>
                                    <Typography level="title-lg">Edit Details</Typography>
                                    <Typography sx={{ mb: 2 }}>Here you can edit the details of the theme.</Typography>

                                    <ThemeEditForm data={data} onUpdate={() => mutate()} />
                                </CardContent>
                            </Card>
                            {/*<Card
                            variant="outlined"
                            color="danger"
                        >
                            <CardContent>
                                <Typography level="title-lg">Delete Theme</Typography>
                                <Typography>To delete this theme, click the button below. Please note that this is not reversible action.</Typography>

                                <Button
                                    variant="solid"
                                    color="danger"
                                    sx={{
                                        mt: 2,
                                        width: "fit-content"
                                    }}
                                >
                                    Delete Theme
                                </Button>
                            </CardContent>
                        </Card>*/}
                        </TabPanel>
                    </Tabs>
                </MainLayout>
            )}
        </ExpectSWRErrors>
    )
}