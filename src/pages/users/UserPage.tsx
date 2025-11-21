import useSWR from "swr";
import {useGateway} from "../../module/client/hooks/useGateway.ts";
import {LoadingPage} from "../LoadingPage.tsx";
import {ExpectSWRErrors} from "../../components/ExpectSWRErrors.tsx";
import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {UserBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {useParams} from "react-router-dom";
import {Card, CardContent, Box, Typography, TabList, tabClasses, Tab, TabPanel, Tabs, FormControl, FormLabel, Input, Button} from "@mui/joy";
import {humanifyRole} from "../../module/shared/util/role.ts";
import {useEffect, useMemo, useState} from "react";
import {useAuth} from "../../module/auth/hooks/useAuth.ts";
import {type SubmitHandler, useForm} from "react-hook-form";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";
import {useNotification} from "../../hooks/useNotification.ts";

type ChangePasswordFormInputs = {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const ChangePasswordForm = () => {
    const gatewayCall = useGatewayCall();
    const {setNotification} = useNotification();

    const {register, handleSubmit, reset} = useForm<ChangePasswordFormInputs>();

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [fetching, setFetching] = useState<boolean>(false);

    const handleFormSubmit: SubmitHandler<ChangePasswordFormInputs> = (data) => {
        if (data.newPassword !== data.confirmNewPassword) {
            return;
        }

        setFetching(true);
        gatewayCall((gateway) => {
            return gateway.changeOwnPassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            });
        })
            .then(() => {
                setNotification("Password changed successfully.");
                reset();
            })
            .finally(() => setFetching(false));
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
            <FormControl>
                <FormLabel>Old Password</FormLabel>
                <Input
                    type="password"
                    placeholder="Old Password"

                    required

                    {...register("oldPassword")}
                />
            </FormControl>
            <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input
                    type="password"
                    placeholder="New Password"

                    required

                    {...register("newPassword", {
                        onChange: (e) => setNewPassword(e.target.value)
                    })}
                />
            </FormControl>
            <FormControl
                error={!(newPassword === "" || newPassword === confirmNewPassword)}
            >
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                    type="password"
                    placeholder="Confirm New Password"

                    required

                    {...register("confirmNewPassword", {
                        onChange: (e) => setConfirmNewPassword(e.target.value)
                    })}
                />
            </FormControl>
            <Button
                type="submit"
                variant="solid"
                color="primary"
                disabled={fetching}
                loading={fetching}
            >
                Change Password
            </Button>
        </form>
    )
}

export const UserPage = () => {
    const {userId} = useParams<{ userId: string }>();
    
    const {user: loggedInUser} = useAuth();
    const gateway = useGateway();

    const {data, isLoading, error, mutate} = useSWR("user", () => gateway.getUser({ userId: Number(userId) }));

    const isSelf = useMemo(() => {
        return data ? data.id === loggedInUser?.id : false;
    }, [data, loggedInUser?.id]);
    
    useEffect(() => {
        mutate();
    }, [mutate, userId]);

    if (isLoading || data && data.id.toString() !== userId) {
        return <LoadingPage />;
    }

    return (
        <ExpectSWRErrors errors={[error]}>
            {data && (
                <MainLayout title="Profile" breadcrumbNodes={UserBreadcrumbNodes}>
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
                            {isSelf ? <Tab disableIndicator>Settings</Tab> : null}
                        </TabList>
                        <TabPanel value={0}>
                            <Card>
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                    }}
                                >
                                    <Box>
                                        <Typography level="body-lg">Name</Typography>
                                        <Typography>{data.name}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography level="body-lg">Role</Typography>
                                        <Typography>{humanifyRole(data.role)}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </TabPanel>
                        {isSelf ? (
                            <TabPanel value={1} sx={{ px: 0 }}>
                                <Card variant="plain">
                                    <CardContent>
                                        <Typography level="title-lg">Change password</Typography>
                                        <Typography sx={{ mb: 2 }}>Here you can change your password.</Typography>

                                        <ChangePasswordForm />
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