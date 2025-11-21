import {
    Box,
    ListItemContent,
    ListItemDecorator,
    Sheet,
    Typography,
    List,
    ListItem,
    ListItemButton, type ListItemButtonProps,
} from "@mui/joy";
import {Home, KeyboardArrowDown, Campaign, FormatListBulleted, Settings} from '@mui/icons-material';
import {useLocation, useNavigate} from "react-router-dom";
import {type Dispatch, type ReactNode, type SetStateAction, useMemo, useState} from "react";
import {RestrictedByPrivilege} from "./access/RestrictedByPrivilege.tsx";
import {ProfileDropdown} from "./ProfileDropdown.tsx";
import {useAuth} from "../module/auth/hooks/useAuth.ts";
import type {Privilege} from "../module/client/model/user.ts";

const SidebarButton = (
    {path, preventHighlight, children, ...rest}: ListItemButtonProps & { path?: string, preventHighlight?: boolean }
) => {
    const loc = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
        if (path) {
            navigate(path);
        }
    }

    return (
        <ListItemButton
            selected={preventHighlight != true && (loc.pathname == path || (path !== undefined && loc.pathname.startsWith(path) && path !== "/app"))}
            onClick={handleClick}
            sx={{
                borderRadius: '8px',
                px: 1,
            }}
            {...rest}
        >
            {children}
        </ListItemButton>
    )
}

type TogglerProps = {
    open?: boolean;
    defaultExpanded?: boolean;
    children: ReactNode;
    renderToggle: (params: {
        open: boolean;
        setOpen: Dispatch<SetStateAction<boolean>>;
    }) => ReactNode;
}

export const ToggleComponent = ({
        open: managedOpen,
        defaultExpanded = false,
        renderToggle,
        children
    }: TogglerProps) => {
    const [stateOpen, setOpen] = useState(defaultExpanded);

    const open = useMemo(() => {
        return managedOpen ?? stateOpen;
    }, [managedOpen, stateOpen]);

    return (
        <Box>
            {renderToggle({ open: managedOpen ?? open, setOpen })}

            <Box
                sx={[
                    {
                        display: 'grid',
                        transition: '0.2s ease',
                        '& > *': {
                            overflow: 'hidden',
                        },
                    },
                    open ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' },
                ]}
            >
                {open ? children : null}
            </Box>
        </Box>
    );
}

export const Sidebar = () => {
    const location = useLocation();

    const {user} = useAuth();

    const hasAnyAdminPrivilege = useMemo(() => {
        if (!user) {
            return false;
        }

        const adminPrivileges = [
            "MANAGE_USERS",
            "MANAGE_THEMES",
            "MANAGE_CAMPAIGNS",
            "MANAGE_STEPS"
        ] as Privilege[];

        return user.privileges.some(privilege => adminPrivileges.includes(privilege));
    }, [user]);

    return (
        <Sheet
            color="neutral"
            sx={{
                position: { xs: 'fixed', md: 'sticky' },
                width: "240px",
                height: "100vh",
                py: 3,
                px: 3,
                gap: 4,
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 1,
                }}
            >
                <Typography
                    level="title-lg"
                    sx={{
                        fontWeight: 'bold',
                    }}
                >IIS</Typography>

                <ProfileDropdown />
            </Box>

            <Box>
                <List
                    sx={{
                        gap: 1,
                    }}
                >
                    <ListItem>
                        <SidebarButton path="/app">
                            <ListItemDecorator><Home /></ListItemDecorator>
                            <ListItemContent>Home</ListItemContent>
                        </SidebarButton>
                    </ListItem>
                    <RestrictedByPrivilege privilege="VIEW_ASSIGNED_CAMPAIGNS">
                        <SidebarButton path="/app/campaigns/assigned">
                            <ListItemDecorator><Campaign /></ListItemDecorator>
                            <ListItemContent>My Campaigns</ListItemContent>
                        </SidebarButton>
                    </RestrictedByPrivilege>
                    <RestrictedByPrivilege privilege="VIEW_ASSIGNED_STEPS">
                        <SidebarButton path="/app/steps/assigned">
                            <ListItemDecorator><FormatListBulleted /></ListItemDecorator>
                            <ListItemContent>My Steps</ListItemContent>
                        </SidebarButton>
                    </RestrictedByPrivilege>
                    {hasAnyAdminPrivilege ? (
                        <ToggleComponent
                            renderToggle={({ open, setOpen }) => (
                                <SidebarButton onClick={() => setOpen(!open)}>
                                    <ListItemDecorator><Settings /></ListItemDecorator>
                                    <ListItemContent>Settings</ListItemContent>
                                    <KeyboardArrowDown
                                        sx={[
                                            open
                                                ? {
                                                    transform: 'rotate(180deg)',
                                                }
                                                : {
                                                    transform: 'none',
                                                },
                                        ]}
                                    />
                                </SidebarButton>
                            )}

                            {...([
                                "/app/users",
                                "/app/themes",
                                "/app/campaigns",
                                "/app/steps"
                            ].some(path => location.pathname.startsWith(path))
                                && !location.pathname.includes("assigned")
                                && !location.pathname.startsWith("/app/users/") ? { open: true } : {})}
                        >
                            <List sx={{ gap: 0.5, mx: 1, mt: 1 }}>
                                <RestrictedByPrivilege privilege="MANAGE_USERS">
                                    <ListItem>
                                        <SidebarButton path="/app/users" preventHighlight>
                                            <ListItemContent>Users</ListItemContent>
                                        </SidebarButton>
                                    </ListItem>
                                </RestrictedByPrivilege>
                                <RestrictedByPrivilege privilege="MANAGE_THEMES">
                                    <ListItem>
                                        <SidebarButton path="/app/themes" preventHighlight>
                                            <ListItemContent>Themes</ListItemContent>
                                        </SidebarButton>
                                    </ListItem>
                                </RestrictedByPrivilege>
                                <RestrictedByPrivilege privilege="MANAGE_CAMPAIGNS">
                                    <ListItem>
                                        <SidebarButton
                                            path="/app/campaigns"
                                            sx={{ borderRadius: 8 }}
                                            preventHighlight
                                        >Campaigns</SidebarButton>
                                    </ListItem>
                                </RestrictedByPrivilege>
                            </List>
                        </ToggleComponent>
                    ) : null}
                </List>
            </Box>
        </Sheet>
    )
}