import {useNavigate, useParams} from "react-router-dom";
import {useGateway} from "../../module/client/hooks/useGateway.ts";
import useSWR from "swr";
import {LoadingPage} from "../LoadingPage.tsx";
import {ExpectSWRErrors} from "../../components/ExpectSWRErrors.tsx";
import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {StepEditBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {
    Box,
    Button,
    Card,
    CardContent,
    Tab,
    tabClasses,
    TabList,
    TabPanel,
    Tabs,
    Typography
} from "@mui/joy";
import {UserSelector} from "../../components/UserSelector.tsx";
import type {User} from "../../module/client/model/user.ts";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";
import {Fragment, useState} from "react";
import {UserLink} from "../../components/UserLink.tsx";
import {RevalidateTable, type RevalidateTableProps} from "../../components/table/RevalidateTable.tsx";
import type {Activity} from "../../module/client/model/activity.ts";
import {DeleteForever} from "@mui/icons-material";
import {ActivityStateBadge} from "../../components/ActivityStateBadge.tsx";
import {AppLink} from "../../components/AppLink.tsx";

const ActivitiesTable = (
    {stepId}: { stepId: number }
) => {
    const gatewayCall = useGatewayCall();

    const [integrityKey, setIntegrityKey] = useState<number>(0);
    const [controlsLocked, setControlsLocked] = useState<boolean>(false);

    const handleRevalidateActivities: RevalidateTableProps<Activity>["revalidate"] = (pageIndex) => {
        return gatewayCall((gateway) => {
            return gateway.listActivities({
                stepId,
                page: {
                    index: pageIndex,
                    size: 10
                }
            });
        });
    }

    const handleDelete = (activityId: number) => {
        setControlsLocked(true);

        gatewayCall((gateway) => {
            return gateway.deleteActivity({ activityId });
        })
            .then(() => setIntegrityKey(Date.now()))
            .finally(() => setControlsLocked(false));
    }

    return (
        <RevalidateTable integrityKey={integrityKey} revalidate={handleRevalidateActivities}>
            {(items) => (
                <Fragment>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>State</th>
                        <th style={{ width: '50px' }} />
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((activity) => (
                        <tr key={activity.id}>
                            <td><AppLink to={`/app/activities/${activity.id}/edit`}>{activity.name}</AppLink></td>
                            <td><ActivityStateBadge state={activity.state} /></td>
                            <td>
                                <Button
                                    variant="plain"
                                    color="neutral"
                                    size="sm"
                                    onClick={() => handleDelete(activity.id)}
                                    disabled={controlsLocked}
                                >
                                    <DeleteForever />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Fragment>
            )}
        </RevalidateTable>
    )
}

export const StepSettingsPage = () => {
    const {stepId} = useParams<{ stepId: string }>();

    const gateway = useGateway();
    const gatewayCall = useGatewayCall();
    const navigate = useNavigate();

    const {data, error, isLoading, mutate} = useSWR("step", () => gateway.inspectCampaignStep({ stepId: Number(stepId) }));

    const [assignedUserSelectorDisabled, setAssignedUserSelectorDisabled] = useState<boolean>(false);

    const handleChangeAssignedUser = (user: User | undefined) => {
        setAssignedUserSelectorDisabled(true);

        gatewayCall((gateway) => {
            return gateway.assignUserToCampaignStep({
                stepId: Number(stepId),
                userId: user ? user.id : undefined
            });
        })
            .then(() => mutate())
            .finally(() => setAssignedUserSelectorDisabled(false));
    }

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <ExpectSWRErrors errors={[error]}>
            {data && (
                <MainLayout
                    title={data.step.name}
                    breadcrumbNodes={StepEditBreadcrumbNodes(data.step)}
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
                            <Tab disableIndicator>Activities</Tab>
                            {data.accessPrivileges.ASSIGN_STAFF ? (
                                <Tab disableIndicator>Settings</Tab>
                            ) : null}
                        </TabList>
                        <TabPanel value={0}>
                            <Card variant="plain">
                                <CardContent>
                                    <Typography level="title-lg">Assigned Staff</Typography>
                                    {data.assignedUserId ? <UserLink userId={data.assignedUserId} /> : <Typography>No staff assigned</Typography>}
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
                                <Button onClick={() => navigate(`/app/steps/${stepId}/createactivity`)}>Create Activity</Button>
                            </Box>
                            <ActivitiesTable stepId={Number(stepId)} />
                        </TabPanel>
                        {data.accessPrivileges.ASSIGN_STAFF ? (
                            <TabPanel value={2} sx={{ px: 0 }}>
                                <Card variant="plain">
                                    <CardContent>
                                        <Typography level="title-lg">Assign Staff</Typography>
                                        <Typography sx={{mb: 2}}>Use the selector below to assign a user to manage this
                                            step.</Typography>

                                        <UserSelector
                                            selected={data.assignedUserId}
                                            onSelected={(user) => handleChangeAssignedUser(user)}
                                            disabled={assignedUserSelectorDisabled}
                                        />
                                    </CardContent>
                                </Card>
                            </TabPanel>
                        ) : null}
                    </Tabs>
                </MainLayout>
            )}
        </ExpectSWRErrors>
    )
}