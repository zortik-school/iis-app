import {Routes as ReactRouterRoutes, Route} from "react-router-dom";
import {MainPage} from "../pages/MainPage.tsx";
import {ProtectedPage} from "../middlewares/ProtectedPage.tsx";
import {RegisterPage} from "../pages/auth/RegisterPage.tsx";
import {LoginPage} from "../pages/auth/LoginPage.tsx";
import {AppPage} from "../pages/AppPage.tsx";
import {UsersPage} from "../pages/users/UsersPage.tsx";
import {PrivilegedPage} from "../middlewares/PrivilegedPage.tsx";
import {NotFoundPage} from "../pages/NotFoundPage.tsx";

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
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </ReactRouterRoutes>
    )
}