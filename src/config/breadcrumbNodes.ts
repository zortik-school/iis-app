import type {Node} from "../components/AppBreadcrumb.tsx";

export const HomeBreadcrumbNodes: Node[] = [
    { name : 'Home', url: '/app' },
]

export const UsersBreadcrumbNodes: Node[] = [
    ...HomeBreadcrumbNodes,
    { name : 'Users', url: '/app/users' },
]

export const ThemesBreadcrumbNodes: Node[] = [
    ...HomeBreadcrumbNodes,
    { name : 'Themes', url: '/app/themes' },
]