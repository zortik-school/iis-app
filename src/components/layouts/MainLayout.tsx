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
                    }}
                >
                    <Box sx={{ width: "100%" }}>
                        <AppBreadcrumb nodes={breadcrumbNodes} />
                    </Box>
                    <Box sx={{ width: "100%" }}>
                        <Typography level="h1">{title}</Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        py: 2,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    )
}