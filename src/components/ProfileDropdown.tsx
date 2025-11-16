import {Dropdown, IconButton, Menu, MenuButton, MenuItem} from "@mui/joy";
import Person2 from "@mui/icons-material/Person2";
import {useAuth} from "../module/auth/hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";

export const ProfileDropdown = () => {
    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        logout().then(() => navigate("/"));
    }

    return (
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
    )
}