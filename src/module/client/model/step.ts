export interface CampaignStep {
    id: number;
    name: string;
}

export interface CampaignStepFull {
    id: number;
    name: string;
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