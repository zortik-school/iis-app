import {
    Box,
    Dropdown,
    IconButton,
    ListItemContent,
    ListItemDecorator,
    Menu,
    MenuButton,
    MenuItem,
    Sheet,
    Typography,
    List,
    ListItem,
    ListItemButton,
} from "@mui/joy";
import Person2 from '@mui/icons-material/Person2';
import Home from '@mui/icons-material/Home';
import {useAuth} from "../module/auth/hooks/useAuth.ts";
import {useLocation, useNavigate} from "react-router-dom";
import type {PropsWithChildren} from "react";
import {RestrictedByPrivilege} from "./access/RestrictedByPrivilege.tsx";

const SidebarButton = (
    {path, children}: PropsWithChildren & { path: string }
) => {
    const loc = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(path);
    }

    return (
        <ListItemButton
            selected={loc.pathname == path}
            onClick={handleClick}
            sx={{
                borderRadius: '8px',
            }}
        >
            {children}
        </ListItemButton>
    )
}

export const Sidebar = () => {
    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        logout().then(() => navigate("/"));
    }

    return (
        <Sheet
            color="neutral"
            sx={{
                position: { xs: 'fixed', md: 'sticky' },
                width: "240px",
                height: "100vh",
                py: 3,
                px: 3,
                gap: 2,
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Typography
                    level="title-lg"
                    sx={{
                        fontWeight: 'bold',
                        ml: 1,
                    }}
                >IIS</Typography>
                <Dropdown>
                    <MenuButton
                        slots={{ root: IconButton }}
                        slotProps={{ root: { variant: 'outlined', color: 'neutral', size: 'sm' } }}
                        sx={{
                            ml: 'auto',
                        }}
                    >
                        <Person2 />
                    </MenuButton>

                    <Menu placement="bottom-start">
                        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                    </Menu>
                </Dropdown>
            </Box>

            <Box>
                <List>
                    <ListItem>
                        <SidebarButton path="/app">
                            <ListItemDecorator><Home /></ListItemDecorator>
                            <ListItemContent>Home</ListItemContent>
                        </SidebarButton>
                    </ListItem>
                    <RestrictedByPrivilege privilege="MANAGE_USERS">
                        <ListItem>
                            <SidebarButton path="/app/users">
                                <ListItemDecorator><Home /></ListItemDecorator>
                                <ListItemContent>Users</ListItemContent>
                            </SidebarButton>
                        </ListItem>
                    </RestrictedByPrivilege>
                </List>
            </Box>
        </Sheet>
    )
}