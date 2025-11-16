import {Link, Breadcrumbs, Typography} from "@mui/joy";
import {Link as RouterLink} from "react-router-dom";

export type Node = {
    name: string,
    url: string;
}

export interface AppBreadcrumbProps {
    nodes: Node[];
}

export const AppBreadcrumb = (
    {nodes}: AppBreadcrumbProps
) => {
    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
                px: 0,
            }}
        >
            {nodes
                .filter((_, index) => index !== nodes.length - 1)
                .map((node, index) => (
                    <Link
                        key={index}
                        color="neutral"
                        to={node.url}
                        underline="hover"
                        aria-current={index === nodes.length - 1 ? "page" : undefined}
                        component={RouterLink}
                    >
                        {node.name}
                    </Link>
                ))}

            <Typography>{nodes[nodes.length - 1].name}</Typography>
        </Breadcrumbs>
    )
}