import type {PageArgs, PageResponse} from "./util.ts";

export interface CampaignStep {
    id: number;
    name: string;
    campaignId: number;
}

export interface CampaignStepFull extends CampaignStep {
    active: boolean;
}

export interface GetCampaignStepsForCampaignArgs {
    campaignId: number;
}

export type GetCampaignStepsForCampaignResponse = CampaignStepFull[];

export interface AddCampaignStepArgs {
    campaignId: number;
    name: string;
}

export type AddCampaignStepResponse = CampaignStep;

export interface ActivateCampaignStepArgs {
    stepId: number;
}

export interface ListCampaignStepsArgs extends PageArgs {
    /**
     * If assigned is true, only return campaigns assigned to the user.
     */
    assigned?: boolean;
}

export type ListCampaignStepsResponse = PageResponse<CampaignStep>;

export interface InspectCampaignStepArgs {
    stepId: number;
}

export type InspectAccessPrivilege = "ASSIGN_STAFF";

export interface InspectCampaignStepResponse {
    step: CampaignStep;
    assignedUserId?: number;
    accessPrivileges: Record<InspectAccessPrivilege, boolean>;
}

export interface AssignUserToCampaignStepArgs {
    stepId: number;
    userId?: number;
}