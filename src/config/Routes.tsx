import {Routes as ReactRouterRoutes, Route} from "react-router-dom";
import {MainPage} from "../pages/MainPage.tsx";
import {ProtectedPage} from "../middlewares/ProtectedPage.tsx";
import {RegisterPage} from "../pages/auth/RegisterPage.tsx";
import {LoginPage} from "../pages/auth/LoginPage.tsx";
import {AppPage} from "../pages/AppPage.tsx";
import {UsersPage} from "../pages/users/UsersPage.tsx";
import {PrivilegedPage} from "../middlewares/PrivilegedPage.tsx";
import {NotFoundPage} from "../pages/NotFoundPage.tsx";
import {ThemesPage} from "../pages/themes/ThemesPage.tsx";
import {CreateThemePage} from "../pages/themes/CreateThemePage.tsx";
import {ThemeSettingsPage} from "../pages/themes/ThemeSettingsPage.tsx";
import {AssignedCampaignsPage} from "../pages/campaigns/AssignedCampaignsPage.tsx";
import {CreateCampaignPage} from "../pages/campaigns/CreateCampaignPage.tsx";
import {CampaignSettingsPage} from "../pages/campaigns/CampaignSettingsPage.tsx";
import {CampaignsPage} from "../pages/campaigns/CampaignsPage.tsx";
import {AssignedStepsPage} from "../pages/steps/AssignedStepsPage.tsx";
import {StepSettingsPage} from "../pages/steps/StepSettingsPage.tsx";
import {UserPage} from "../pages/users/UserPage.tsx";
import {CreateActivityPage} from "../pages/activities/CreateActivityPage.tsx";
import {ActivitiesBrowserPage} from "../pages/activities/ActivitiesBrowserPage.tsx";
import {ActivitySettingsPage} from "../pages/activities/ActivitySettingsPage.tsx";
import {ActivityViewPage} from "../pages/activities/ActivityViewPage.tsx";

export const Routes = () => {
    return (
        <ReactRouterRoutes>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />

            <Route element={<ProtectedPage />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/app" element={<AppPage />} />
                <Route element={<PrivilegedPage privilege="MANAGE_USERS" />}>
                    <Route path="/app/users" element={<UsersPage />} />
                </Route>
                <Route element={<PrivilegedPage privilege="MANAGE_THEMES" />}>
                    <Route path="/app/themes" element={<ThemesPage />} />
                    <Route path="/app/themes/create" element={<CreateThemePage />} />
                    <Route path="/app/themes/:themeId/edit" element={<ThemeSettingsPage />} />
                </Route>
                <Route element={<PrivilegedPage privilege="MANAGE_CAMPAIGNS" />}>
                    <Route path="/app/campaigns" element={<CampaignsPage />} />
                    <Route path="/app/themes/:themeId/createcampaign" element={<CreateCampaignPage />} />
                </Route>
                <Route element={<PrivilegedPage privilege="VIEW_ASSIGNED_CAMPAIGNS" />}>
                    <Route path="/app/campaigns/assigned" element={<AssignedCampaignsPage />} />
                    <Route path="/app/campaigns/:campaignId/edit" element={<CampaignSettingsPage />} />
                </Route>
                <Route element={<PrivilegedPage privilege="VIEW_ASSIGNED_STEPS" />}>
                    <Route path="/app/steps/assigned" element={<AssignedStepsPage />} />
                    <Route path="/app/steps/:stepId/edit" element={<StepSettingsPage />} />
                    <Route path="/app/steps/:stepId/createactivity" element={<CreateActivityPage />} />
                    <Route path="/app/activities/:activityId/edit" element={<ActivitySettingsPage />} />
                </Route>
                <Route element={<PrivilegedPage privilege={"VIEW_ASSIGNED_ACTIVITIES"} />}>
                    <Route path="/app/activities/browser" element={<ActivitiesBrowserPage />} />
                    <Route path="/app/activities/:activityId" element={<ActivityViewPage />} />
                </Route>
                <Route path="/app/users/:userId" element={<UserPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </ReactRouterRoutes>
    )
}