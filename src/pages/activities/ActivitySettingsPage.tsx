import {useParams} from "react-router-dom";
import {useGateway} from "../../module/client/hooks/useGateway.ts";
import useSWR from "swr";
import {LoadingPage} from "../LoadingPage.tsx";
import {ExpectSWRErrors} from "../../components/ExpectSWRErrors.tsx";
import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {ActivityEditBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {
    Box, Button,
    Card,
    CardContent, Dropdown, Menu, MenuButton, MenuItem,
    Tab,
    tabClasses,
    TabList,
    TabPanel,
    Tabs,
    Typography
} from "@mui/joy";
import {Fragment, useCallback, useState} from "react";
import {ArrowDropDown, DeleteForever} from "@mui/icons-material";
import type {ActivityState} from "../../module/client/model/activity.ts";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";
import {type Question, useConfirmModal} from "../../components/modal/ConfirmModalContext.tsx";
import {RevalidateTable, type RevalidateTableProps} from "../../components/table/RevalidateTable.tsx";
import type {User} from "../../module/client/model/user.ts";
import {UserSelector} from "../../components/UserSelector.tsx";
import {UserLink} from "../../components/UserLink.tsx";

const UsersManagementTab = (
    {activityId}: { activityId: number }
) => {
    const gatewayCall = useGatewayCall();
    const {setQuestion} = useConfirmModal();

    const [integrityKey, setIntegrityKey] = useState<number>(0);
    const [userSelectorShown, setUserSelectorShown] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);

    const revalidate: RevalidateTableProps<User>["revalidate"] = useCallback(async (pageIndex) => {
        return gatewayCall((gateway) => {
            return gateway.listUsers({
                activityId,
                page: {
                    index: pageIndex,
                    size: 10
                }
            });
        });
    }, [activityId, gatewayCall]);

    const handleOnSelected = useCallback((user: User | undefined) => {
        setUserSelectorShown(false);
        if (user == undefined) {
            return;
        }
        if (fetching) {
            return;
        }

        setFetching(true);
        gatewayCall((gateway) => {
            return gateway.addUserToActivity({
                activityId,
                userId: user.id
            });
        })
            .then(() => setIntegrityKey(Date.now()))
            .finally(() => setFetching(false));
    }, [activityId, fetching, gatewayCall]);

    const handleDelete = useCallback((userId: number) => {
        if (fetching) {
            return;
        }

        const question: Question = {
            title: "Remove User from Activity?",
            message: "Are you sure you want to remove this user from the activity? This action cannot be undone.",
            onConfirm: () => {
                setFetching(true);
                gatewayCall((gateway) => {
                    return gateway.removeUserFromActivity({
                        activityId,
                        userId
                    });
                })
                    .then(() => setIntegrityKey(Date.now()))
                    .finally(() => setFetching(false));
            }
        }

        setQuestion(question);
    }, [activityId, fetching, gatewayCall, setQuestion]);

    return (
        <Fragment>
            <Box
                sx={{
                    maxWidth: "250px",
                }}
            >
                {!userSelectorShown && (
                    <Button
                        sx={{
                            mt: 1
                        }}
                        onClick={() => setUserSelectorShown(true)}
                        disabled={fetching}
                        loading={fetching}
                    >Add User</Button>
                )}
                {userSelectorShown && (
                    <UserSelector
                        sx={{
                            mt: 1,
                        }}
                        onSelected={handleOnSelected}
                    />
                )}
            </Box>
            <RevalidateTable integrityKey={integrityKey} revalidate={revalidate}>
                {(users) => (
                    <Fragment>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th style={{ width: '50px' }} />
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <UserLink userId={user.id}>{user.name}</UserLink>
                                </td>
                                <td>
                                    <Button
                                        variant="plain"
                                        color="neutral"
                                        size="sm"
                                        onClick={() => handleDelete(user.id)}
                                        disabled={fetching}
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
        </Fragment>
    )
}

export const ActivitySettingsPage = () => {
    const {activityId} = useParams<{ activityId: string }>();

    const gateway = useGateway();
    const gatewayCall = useGatewayCall();

    const {data, error, isLoading, mutate} = useSWR("activity", () => gateway.inspectActivity({ activityId: Number(activityId) }));
    const [controlsLocked, setControlsLocked] = useState<boolean>(false);

    const handleChangeState = (state: ActivityState) => {
        setControlsLocked(true);

        let promise: Promise<unknown>;
        switch (state) {
            case "OPEN":
                promise = gatewayCall((gateway) => gateway.openActivity({ activityId: Number(activityId) }));
                break;
            case "IN_PROGRESS":
                promise = Promise.resolve(); // TODO
                break;
            case "CLOSED":
                promise = gatewayCall((gateway) => gateway.closeActivity({ activityId: Number(activityId) }));
                break;
        }
        promise
            .then(() => mutate())
            .finally(() => setControlsLocked(false));
    }

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <ExpectSWRErrors errors={[error]}>
            {data && (
                <MainLayout
                    title="Edit Activity"
                    breadcrumbNodes={ActivityEditBreadcrumbNodes(data.activity)}
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
                            {data.accessPrivileges.ASSIGN_STAFF ? (
                                <Fragment>
                                    <Tab disableIndicator>Executors</Tab>
                                    <Tab disableIndicator>Requests</Tab>
                                </Fragment>
                            ) : null}
                            <Tab disableIndicator>Settings</Tab>
                        </TabList>
                        <TabPanel value={0}>
                            <Card variant="plain">
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                    }}
                                >
                                    <Box>
                                        <Typography level="title-lg">Name</Typography>
                                        {data.activity.name}
                                    </Box>

                                    <Box>
                                        <Typography level="title-lg">Description</Typography>
                                        {data.activity.description}
                                    </Box>

                                    <Box>
                                        <Typography level="title-lg">State</Typography>
                                        {data.activity.state}
                                    </Box>
                                </CardContent>
                            </Card>
                        </TabPanel>
                        <TabPanel value={1} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <UsersManagementTab activityId={Number(activityId)} />
                        </TabPanel>
                        <TabPanel value={2}>
                            {/* TODO user requests */}
                        </TabPanel>
                        {data.accessPrivileges.ASSIGN_STAFF ? (
                            <TabPanel value={3} sx={{ px: 0 }}>
                                <Card variant="plain">
                                    <CardContent>
                                        <Typography level="title-lg">Change state</Typography>
                                        <Typography sx={{mb: 2}}>Use the selector below to change state of this activity.</Typography>

                                        <Box>
                                            <Dropdown>
                                                <MenuButton
                                                    disabled={controlsLocked}
                                                    loading={controlsLocked}
                                                    endDecorator={<ArrowDropDown />}
                                                    size="sm"
                                                    sx={{
                                                        textTransform: 'none',
                                                        mx: 0,
                                                    }}
                                                >{data.activity.state}</MenuButton>
                                                <Menu>
                                                    {([
                                                        "OPEN",
                                                        "IN_PROGRESS",
                                                        "CLOSED"
                                                    ] as ActivityState[])
                                                        .filter((state) => state !== data.activity.state)
                                                        .map((state) => {
                                                            return (
                                                                <MenuItem
                                                                    key={data.activity.id + "-" + state}
                                                                    onClick={() => handleChangeState(state)}
                                                                >
                                                                    {state}
                                                                </MenuItem>
                                                            )
                                                        })}
                                                </Menu>
                                            </Dropdown>
                                        </Box>
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