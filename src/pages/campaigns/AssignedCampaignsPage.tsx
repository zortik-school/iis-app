import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {AssignedCampaignsBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {CampaignsTable} from "../../components/table/CampaignsTable.tsx";

export const AssignedCampaignsPage = () => {
    return (
        <MainLayout title="Assigned Campaigns" breadcrumbNodes={AssignedCampaignsBreadcrumbNodes}>
            <CampaignsTable assigned />
        </MainLayout>
    )
}