import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {ThemesBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {RevalidateTable, type RevalidateTableProps} from "../../components/RevalidateTable.tsx";
import {Fragment, useState} from "react";
import type {Theme} from "../../module/client/model/theme.ts";
import {useGateway} from "../../module/client/hooks/useGateway.ts";

export const ThemesPage = () => {
    const gateway = useGateway();

    const [integrityKey] = useState<number>(0);
    
    const revalidate: RevalidateTableProps<Theme>["revalidate"] = (pageIndex) => {
        return gateway.listThemes({
            page: {
                index: pageIndex,
                size: 20
            }
        })
    }

    return (
        <MainLayout title="Themes" breadcrumbNodes={ThemesBreadcrumbNodes}>
            <RevalidateTable integrityKey={integrityKey} revalidate={revalidate}>
                {(themes) => (
                    <Fragment>
                        <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {themes.map((theme) => (
                            <tr key={theme.id}>
                                <td>{theme.name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Fragment>
                )}
            </RevalidateTable>
        </MainLayout>
    )
}