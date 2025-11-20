import {useParams} from "react-router-dom";
import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {CampaignEditBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import useSWR from "swr";
import {useGateway} from "../../module/client/hooks/useGateway.ts";
import {LoadingPage} from "../LoadingPage.tsx";
import {ExpectSWRErrors} from "../../components/ExpectSWRErrors.tsx";
import {Box, Card, CardContent, Tab, tabClasses, TabList, TabPanel, Tabs, Typography} from "@mui/joy";
import {UserSelector} from "../../components/UserSelector.tsx";
import type {User} from "../../module/client/model/user.ts";
import {useEffect, useState} from "react";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";
import {RestrictedByPrivilege} from "../../components/access/RestrictedByPrivilege.tsx";
import type {Theme} from "../../module/client/model/theme.ts";
import {UserLink} from "../../components/UserLink.tsx";

export const CampaignSettingsPage = () => {
    const {campaignId} = useParams<{ campaignId: string }>();

    const gateway = useGateway();
    const gatewayCall = useGatewayCall();

    const {data, isLoading, error, mutate} = useSWR("campaign", () => gateway.inspectCampaign({ campaignId: Number(campaignId) }));
    const [theme, setTheme] = useState<Theme | null>(null);
    const [assignedUser, setAssignedUser] = useState<User | null>(null);
    const [assignedUserSelectorDisabled, setAssignedUserSelectorDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (!data) {
            return;
        }

        gatewayCall((gateway) => {
            return data.assignedUserId
                ? gateway.getUser({ userId: data.assignedUserId! })
                : Promise.resolve(null);
        })
            .then((user) => setAssignedUser(user))
            .catch(() => setAssignedUser(null));
    }, [data, gatewayCall]);

    useEffect(() => {
        if (!data) {
            return;
        }

        gatewayCall((gateway) => {
            return gateway.getTheme({ themeId: data.campaign.themeId });
        })
            .then((theme) => setTheme(theme))
            .catch(() => setAssignedUser(null));
    }, [data, gatewayCall]);

    const handleChangeAssignedUser = (user: User | undefined) => {
        setAssignedUserSelectorDisabled(true);

        gatewayCall((gateway) => {
            return gateway.assignUserToCampaign({
                campaignId: Number(campaignId),
                userId: user ? user.id : undefined
            });
        })
            .then(() => mutate())
            .finally(() => setAssignedUserSelectorDisabled(false));
    }

    if (!data && isLoading) {
        return <LoadingPage />;
    }

    return (
        <ExpectSWRErrors errors={[error]}>
            {data && (
                <MainLayout title={data.campaign.name} breadcrumbNodes={CampaignEditBreadcrumbNodes(data.campaign)}>
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
                            <Tab disableIndicator>Steps</Tab>
                            <RestrictedByPrivilege privilege="MANAGE_CAMPAIGNS">
                                <Tab disableIndicator>Settings</Tab>
                            </RestrictedByPrivilege>
                        </TabList>
                        <TabPanel
                            value={0}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2
                            }}
                        >
                            <Box>
                                <Typography level="title-lg">Theme</Typography>
                                {theme && <Typography>{theme.name}</Typography>}
                            </Box>
                            <Box>
                                <Typography level="title-lg">Assigned Staff</Typography>
                                {assignedUser ? (
                                    <UserLink userId={assignedUser.id}>{assignedUser.name}</UserLink>
                                ) : (
                                    <Typography>No staff assigned</Typography>
                                )}
                            </Box>
                        </TabPanel>
                        <TabPanel value={1}>

                        </TabPanel>
                        <RestrictedByPrivilege privilege="MANAGE_CAMPAIGNS">
                            <TabPanel value={2} sx={{px: 0}}>
                                <Card variant="plain">
                                    <CardContent>
                                        <Typography level="title-lg">Assign Staff</Typography>
                                        <Typography sx={{mb: 2}}>Use the selector below to assign a user to manage this
                                            campaign.</Typography>

                                        <UserSelector
                                            selected={data.assignedUserId}
                                            onSelected={(user) => handleChangeAssignedUser(user)}
                                            disabled={assignedUserSelectorDisabled}
                                        />
                                    </CardContent>
                                </Card>
                                {/*<Card variant="plain">
                                <CardContent>
                                    <Typography level="title-lg">Edit Details</Typography>
                                    <Typography sx={{ mb: 2 }}>Here you can edit the details of the campaign.</Typography>


                                </CardContent>
                            </Card>*/}
                            </TabPanel>
                        </RestrictedByPrivilege>
                    </Tabs>
                </MainLayout>
            )}
        </ExpectSWRErrors>
    )
}