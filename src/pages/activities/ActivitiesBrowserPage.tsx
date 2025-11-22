import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {ActivitiesBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {Tab, tabClasses, TabList, TabPanel, Tabs} from "@mui/joy";
import {ActivitiesTable} from "../../components/table/ActivitiesTable.tsx";

export const ActivitiesBrowserPage = () => {
    // TODO

    return (
        <MainLayout title="Activities" breadcrumbNodes={ActivitiesBreadcrumbNodes}>
            <Tabs
                aria-label="tabs"
                defaultValue={0}
                sx={{
                    bgcolor: 'transparent'
                }}
            >
                <TabList
                    disableUnderline
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        borderRadius: 'lg',
                        bgcolor: 'background.level1',
                        [`& .${tabClasses.root}[aria-selected="true"]`]: {
                            bgcolor: 'background.surface',
                        },
                        maxWidth: "fit-content"
                    }}
                >
                    <Tab disableIndicator>Available</Tab>
                    <Tab disableIndicator>Assigned</Tab>
                </TabList>
                <TabPanel value={0}>
                    <ActivitiesTable privileged={false} available />
                </TabPanel>
                <TabPanel value={1}>
                    <ActivitiesTable privileged={false} assigned />
                </TabPanel>
            </Tabs>
        </MainLayout>
    )
}