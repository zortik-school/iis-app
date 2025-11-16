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
import {Home, Group, EmojiPeople} from '@mui/icons-material';
import {useLocation, useNavigate} from "react-router-dom";
import {type Dispatch, Fragment, type ReactNode, type SetStateAction, useState} from "react";
import {RestrictedByPrivilege} from "./access/RestrictedByPrivilege.tsx";
import {ProfileDropdown} from "./ProfileDropdown.tsx";

const SidebarButton = (
    {path, children, ...rest}: ListItemButtonProps & { path?: string }
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
            selected={loc.pathname == path}
            onClick={handleClick}
            sx={{
                borderRadius: '8px',
            }}
            {...rest}
        >
            {children}
        </ListItemButton>
    )
}

type TogglerProps = {
    defaultExpanded?: boolean;
    children: ReactNode;
    renderToggle: (params: {
        open: boolean;
        setOpen: Dispatch<SetStateAction<boolean>>;
    }) => ReactNode;
}

export const ToggleComponent = ({
        defaultExpanded = false,
        renderToggle,
        children
    }: TogglerProps) => {
    const [open, setOpen] = useState(defaultExpanded);

    return (
        <Fragment>
            {renderToggle({ open, setOpen })}

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
        </Fragment>
    );
}

export const Sidebar = () => {
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
                    <RestrictedByPrivilege privilege="MANAGE_USERS">
                        <ListItem>
                            <SidebarButton path="/app/users">
                                <ListItemDecorator><Group /></ListItemDecorator>
                                <ListItemContent>Users</ListItemContent>
                            </SidebarButton>
                        </ListItem>
                    </RestrictedByPrivilege>
                    <RestrictedByPrivilege privilege="MANAGE_THEMES">
                        <SidebarButton path="/app/themes">
                            <ListItemDecorator><EmojiPeople /></ListItemDecorator>
                            <ListItemContent>Themes</ListItemContent>
                        </SidebarButton>
                    </RestrictedByPrivilege>
                    {/*<ToggleComponent
                        renderToggle={({ open, setOpen }) => (
                            <SidebarButton onClick={() => setOpen(!open)}>
                                <ListItemDecorator><EmojiPeople /></ListItemDecorator>
                                <ListItemContent>Themes</ListItemContent>
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
                    >
                        <List sx={{ gap: 0.5 }}>
                            <ListItem>
                                <ListItemButton>Manage Themes</ListItemButton>
                            </ListItem>
                        </List>
                    </ToggleComponent>*/}
                </List>
            </Box>
        </Sheet>
    )
}