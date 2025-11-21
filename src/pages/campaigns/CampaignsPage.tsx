import {CampaignsTable} from "../../components/table/CampaignsTable.tsx";
import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {CampaignsBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";

export const CampaignsPage = () => {
    return (
        <MainLayout title="Campaigns" breadcrumbNodes={CampaignsBreadcrumbNodes}>
            <CampaignsTable />
        </MainLayout>
    )
}