import type {Node} from "../components/AppBreadcrumb.tsx";
import type {Campaign} from "../module/client/model/campaign.ts";

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

export const CreateThemeBreadcrumbNodes: Node[] = [
    ...ThemesBreadcrumbNodes,
    { name : 'Create Theme', url: '/app/themes/create' },
]

export const ThemeEditBreadcrumbNodes: Node[] = [
    ...ThemesBreadcrumbNodes,
    { name : 'Edit Theme', url: '' },
]

export const AssignedCampaignsBreadcrumbNodes: Node[] = [
    ...HomeBreadcrumbNodes,
    { name : 'Assigned Campaigns', url: '/app/campaigns/assigned' },
]

export const CampaignsBreadcrumbNodes: Node[] = [
    ...HomeBreadcrumbNodes,
    { name : 'Campaigns', url: '/app/campaigns' },
]

export const CampaignEditBreadcrumbNodes = (campaign: Campaign): Node[] => [
    ...HomeBreadcrumbNodes,
    { name : 'Theme', url: `/app/themes/${campaign.themeId}/edit` },
    { name : 'Edit Campaign', url: '' },
]