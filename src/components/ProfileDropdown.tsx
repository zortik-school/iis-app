import {IconButton, MenuButton, MenuItem} from "@mui/joy";
import Person2 from "@mui/icons-material/Person2";
import {useAuth} from "../module/auth/hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import {AppDropdown} from "./AppDropdown.tsx";

export const ProfileDropdown = () => {
    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        logout().then(() => navigate("/"));
    }

    return (
        <AppDropdown
            title="Profile"
            component={(
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'outlined', color: 'neutral', size: 'sm' } }}
                    sx={{
                        ml: 'auto',
                    }}
                >
                    <Person2 />
                </MenuButton>
            )}
        >
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </AppDropdown>
    )
}