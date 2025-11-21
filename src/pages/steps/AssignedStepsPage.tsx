import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {AssignedStepsBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {CampaignStepsTable} from "../../components/table/CampaignStepsTable.tsx";

export const AssignedStepsPage = () => {
    return (
        <MainLayout title="Assigned Steps" breadcrumbNodes={AssignedStepsBreadcrumbNodes}>
            <CampaignStepsTable assigned />
        </MainLayout>
    )
}