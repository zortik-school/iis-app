import {Navigate, Outlet } from "react-router-dom";
import {useAuth} from "../module/auth/hooks/useAuth.ts";
import {LoadingPage} from "../pages/LoadingPage.tsx";

export const ProtectedPage = () => {
    const {ready, user} = useAuth();

    if (!ready) {
        // Loading state
        return <LoadingPage />;
    }

    if (!user) {
        // Not authenticated
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
}