import type {PropsWithChildren} from "react";
import {Box, Typography} from "@mui/joy";
import {Sidebar} from "../Sidebar.tsx";
import {AppBreadcrumb, type Node} from "../AppBreadcrumb.tsx";

export interface MainLayoutProps extends PropsWithChildren {
    title: string;
    breadcrumbNodes: Node[];
}

export const MainLayout = (
    {title, breadcrumbNodes, children}: MainLayoutProps
) => {
    // TODO

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />

            <Box sx={{
                flexGrow: 1,
                px: 8,
                py: 2
            }}>
                <Box
                    sx={{
                        width: "100%",
                        height: "fit-content",
                        display: "flex",
                    }}
                >
                    <Box sx={{ width: "fit-content" }}>
                        <Typography level="h1">{title}</Typography>
                        <AppBreadcrumb nodes={breadcrumbNodes} />
                    </Box>
                </Box>
                <Box>
                    {children}
                </Box>
            </Box>
        </Box>
    )
}