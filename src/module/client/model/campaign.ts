import type {PageArgs, PageResponse} from "./util.ts";

export interface Campaign {
    id: number;
    name: string;
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