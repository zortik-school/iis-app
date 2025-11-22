import {useParams, useNavigate} from "react-router-dom";
import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {CampaignEditBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import useSWR from "swr";
import {useGateway} from "../../module/client/hooks/useGateway.ts";
import {LoadingPage} from "../LoadingPage.tsx";
import {ExpectSWRErrors} from "../../components/ExpectSWRErrors.tsx";
import {
    Box,
    Card,
    CardContent,
    Tab,
    tabClasses,
    TabList,
    TabPanel,
    Tabs,
    Typography,
    Stepper,
    Step,
    StepIndicator,
    Button,
    FormControl,
    FormLabel,
    Input,
    ButtonGroup,
    Chip
} from "@mui/joy";
import {UserSelector} from "../../components/UserSelector.tsx";
import type {User} from "../../module/client/model/user.ts";
import {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";
import {RestrictedByPrivilege} from "../../components/access/RestrictedByPrivilege.tsx";
import type {Theme} from "../../module/client/model/theme.ts";
import {UserLink} from "../../components/UserLink.tsx";
import type {CampaignStep, CampaignStepFull} from "../../module/client/model/step.ts";
import {type SubmitHandler, useForm} from "react-hook-form";
import {StepLink} from "../../components/StepLink.tsx";
import {RevalidateTable, type RevalidateTableProps} from "../../components/table/RevalidateTable.tsx";
import {DeleteForever} from "@mui/icons-material";
import {type Question, useConfirmModal} from "../../components/modal/ConfirmModalContext.tsx";

interface AddStepFormInputs {
    name: string;
}

const AddStepForm = (
    {campaignId, shown, onSubmit}: {
        campaignId: number;
        shown: boolean;
        onSubmit: (step: CampaignStep) => void;
    }
) => {
    const gatewayCall = useGatewayCall();

    const {register, handleSubmit} = useForm<AddStepFormInputs>();
    const [fetching, setFetching] = useState<boolean>(false);

    const handleFormSubmit: SubmitHandler<AddStepFormInputs> = (data) => {
        if (fetching) {
            return;
        }

        setFetching(true);

        gatewayCall((gateway) => {
            return gateway.addCampaignStep({
                name: data.name,
                campaignId,
            });
        })
            .then((step) => onSubmit(step))
            .finally(() => setFetching(false));
    }

    return (
        shown ? (
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="gap-y-4 flex flex-col mt-2"
            >
                <FormControl>
                    <FormLabel>Step name</FormLabel>
                    <Input
                        {...register("name")}

                        required
                    />
                </FormControl>

                <Button
                    type="submit"
                    sx={{ mt: 1 }}
                    disabled={fetching}
                    loading={fetching}
                >Add</Button>
            </form>
        ) : null
    )
}

const UsersManagementTab = (
    {campaignId}: { campaignId: number }
) => {
    const gatewayCall = useGatewayCall();
    const {setQuestion} = useConfirmModal();

    const [integrityKey, setIntegrityKey] = useState<number>(0);
    const [userSelectorShown, setUserSelectorShown] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);

    const revalidate: RevalidateTableProps<User>["revalidate"] = useCallback(async (pageIndex) => {
        return gatewayCall((gateway) => {
            return gateway.listUsers({
                campaignId,
                page: {
                    index: pageIndex,
                    size: 10
                }
            });
        });
    }, [campaignId, gatewayCall]);

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
            return gateway.addUserToCampaign({
                campaignId,
                userId: user.id
            });
        })
            .then(() => setIntegrityKey(Date.now()))
            .finally(() => setFetching(false));
    }, [campaignId, fetching, gatewayCall]);

    const handleDelete = useCallback((userId: number) => {
        if (fetching) {
            return;
        }
        
        const question: Question = {
            title: "Remove User from Campaign?",
            message: "Are you sure you want to remove this user from the campaign? This action cannot be undone.",
            onConfirm: () => {
                setFetching(true);
                gatewayCall((gateway) => {
                    return gateway.removeUserFromCampaign({
                        campaignId,
                        userId
                    });
                })
                    .then(() => setIntegrityKey(Date.now()))
                    .finally(() => setFetching(false));
            }
        }
        
        setQuestion(question);
    }, [campaignId, fetching, gatewayCall, setQuestion]);

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

export const CampaignSettingsPage = () => {
    const {campaignId} = useParams<{ campaignId: string }>();

    const gateway = useGateway();
    const gatewayCall = useGatewayCall();
    const navigate = useNavigate();

    const {data, isLoading, error, mutate} = useSWR(
        "campaign",
        () => gateway.inspectCampaign({ campaignId: Number(campaignId) })
    );
    const [theme, setTheme] = useState<Theme | null>(null);
    const {data: steps, mutate: mutateSteps} = useSWR<CampaignStepFull[]>(
        "campaign-steps",
        () => gatewayCall((gateway) => {
            return gateway.getCampaignStepsForCampaign({ campaignId: Number(campaignId) });
        })
    );
    const [assignedUser, setAssignedUser] = useState<User | null>(null);
    const [assignedUserSelectorDisabled, setAssignedUserSelectorDisabled] = useState<boolean>(false);

    const [addStepFormShown, setAddStepFormShown] = useState<boolean>(false);
    const [stepControlsDisabled, setStepControlsDisabled] = useState<boolean>(false);

    const activeStep = useMemo(() => {
        if (!steps) {
            return null;
        }

        return steps.find((step) => step.active) || null;
    }, [steps]);

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

    const isStepNext = (stepIndex: number): boolean => {
        if (!steps) {
            return false;
        }

        const activeStep = steps.find((step) => step.active);
        /*if (activeStep === undefined) {
            return stepIndex === 0;
        } else {
            const activeStepIndex = steps.indexOf(activeStep);

            return stepIndex === activeStepIndex + 1;
        }*/

        return activeStep === undefined || steps.indexOf(activeStep) !== stepIndex;
    }

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

    const handleActivateStep = (step: CampaignStep) => {
        if (stepControlsDisabled) {
            return;
        }

        setStepControlsDisabled(true);
        gatewayCall((gateway) => gateway.activateCampaignStep({ stepId: step.id }))
            .then(() => mutateSteps())
            .finally(() => setStepControlsDisabled(false));
    }

    const handleStepAdded = () => {
        setAddStepFormShown(false);

        mutateSteps();
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
                            <Tab disableIndicator>Users</Tab>
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
                            <Card variant="plain">
                                <CardContent
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
                                    <Box>
                                        <Typography level="title-lg">Active Step</Typography>
                                        {activeStep ? (
                                            <StepLink stepId={activeStep.id}>{activeStep.name}</StepLink>
                                        ) : (
                                            <Typography>None</Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </TabPanel>
                        <TabPanel value={1}>
                            {steps && (
                                <Stepper orientation="vertical">
                                    {steps.map((step, index) => (
                                        <Step
                                            key={step.id}
                                            indicator={
                                                <StepIndicator
                                                    {...(step.active ? (
                                                        {
                                                            variant: "solid",
                                                            color: "primary"
                                                        }
                                                    ) : (
                                                        {
                                                            variant: "soft",
                                                            color: "neutral"
                                                        }
                                                    ))}
                                                >
                                                    {index+1}
                                                </StepIndicator>
                                            }
                                        >
                                            <Typography>{step.name}</Typography>
                                            <Box>
                                                <ButtonGroup variant="plain" spacing={1}>
                                                    {isStepNext(index) ? (
                                                        <Chip
                                                            color="primary"
                                                            variant="solid"
                                                            onClick={() => handleActivateStep(step)}
                                                            disabled={stepControlsDisabled}
                                                        >
                                                            Activate
                                                        </Chip>
                                                    ) : (
                                                        <Chip
                                                            color="danger"
                                                            variant="soft"
                                                            onClick={() => handleActivateStep(step)}
                                                            disabled={stepControlsDisabled}
                                                        >
                                                            Deactivate
                                                        </Chip>
                                                    )}
                                                    <Chip
                                                        color="neutral"
                                                        variant="outlined"
                                                        onClick={() => navigate(`/app/steps/${step.id}/edit`)}
                                                    >
                                                        Edit
                                                    </Chip>
                                                </ButtonGroup>
                                            </Box>
                                        </Step>
                                    ))}
                                </Stepper>
                            )}
                            {steps && steps.length == 0 && <Typography>No steps created.</Typography>}
                            <AddStepForm
                                campaignId={Number(campaignId)}
                                shown={addStepFormShown}
                                onSubmit={handleStepAdded}
                            />
                            {!addStepFormShown ? (
                                <Button
                                    sx={{
                                        mt: 4
                                    }}
                                    onClick={() => setAddStepFormShown(true)}
                                >Add Step</Button>
                            ) : null}
                        </TabPanel>
                        <TabPanel
                            value={2}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2
                            }}
                        >
                            <UsersManagementTab campaignId={Number(campaignId)} />
                        </TabPanel>
                        <RestrictedByPrivilege privilege="MANAGE_CAMPAIGNS">
                            <TabPanel value={3} sx={{px: 0}}>
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