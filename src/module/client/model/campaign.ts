import type {PageArgs, PageResponse} from "./util.ts";

export interface Campaign {
    id: number;
    name: string;
    themeId: number;
}

export interface ListCampaignsArgs extends PageArgs {
    /**
     * If assigned is true, only return campaigns assigned to the user.
     */
    assigned?: boolean;

    /**
     * If themeId is provided, only return campaigns associated with the given theme.
     */
    themeId?: number;
}

export type ListCampaignsResponse = PageResponse<Campaign>;

export interface CreateCampaignArgs {
    name: string;
    themeId: number;
}

export type CreateCampaignResponse = Campaign;

export interface DeleteCampaignArgs {
    campaignId: number;
}

export interface InspectCampaignArgs {
    campaignId: number;
}

export interface InspectCampaignResponse {
    campaign: Campaign;
    assignedUserId?: number;
}

export interface AssignUserToCampaignArgs {
    campaignId: number;
    userId?: number;
}

export interface AddUserToCampaignArgs {
    campaignId: number;
    userId: number;
}

export interface RemoveUserFromCampaignArgs {
    campaignId: number;
    userId: number;
}