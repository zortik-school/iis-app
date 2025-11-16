import {MainLayout} from "../components/layouts/MainLayout.tsx";
import {HomeBreadcrumbNodes} from "../config/breadcrumbNodes.ts";

export const AppPage = () => {
    // TODO

    return (
        <MainLayout
            title="Home"
            breadcrumbNodes={HomeBreadcrumbNodes}
        >

        </MainLayout>
    )
}