import {Dropdown, Menu} from "@mui/joy";
import type {PropsWithChildren, ReactNode} from "react";

export interface AppDropdownProps extends PropsWithChildren {
    title?: string;
    component: ReactNode;
}

export const AppDropdown = (
    {component, children}: AppDropdownProps
) => {
    return (
        <Dropdown>
            {component}

            <Menu placement="bottom-start">
                {children}
            </Menu>
        </Dropdown>
    )
}