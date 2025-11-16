import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {ThemesBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {RevalidateTable, type RevalidateTableProps} from "../../components/table/RevalidateTable.tsx";
import {Fragment, useState} from "react";
import type {Theme} from "../../module/client/model/theme.ts";
import {DeleteForever} from "@mui/icons-material";
import {Box, Button, Link} from "@mui/joy";
import {type Question, useConfirmModal} from "../../components/modal/ConfirmModalContext.tsx";
import {useNavigate, Link as RouterLink} from "react-router-dom";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";

export const ThemesPage = () => {
    const gatewayCall = useGatewayCall();
    const navigate = useNavigate();
    const {setQuestion} = useConfirmModal();

    const [integrityKey, setIntegrityKey] = useState<number>(0);
    const [controlsLocked, setControlsLocked] = useState<boolean>(false);
    
    const revalidate: RevalidateTableProps<Theme>["revalidate"] = (pageIndex) => {
        return gatewayCall((gateway) => {
            return gateway.listThemes({
                page: {
                    index: pageIndex,
                    size: 10
                }
            });
        });
    }

    const handleDelete = (id: number) => {
        const question: Question = {
            title: "Delete Theme?",
            message: "Are you sure you want to delete this theme? This action cannot be undone.",
            onConfirm: () => {
                setControlsLocked(true);

                gatewayCall((gateway) => {
                    return gateway.deleteTheme({ themeId: id });
                })
                    .then(() => setIntegrityKey(Date.now()))
                    .finally(() => setControlsLocked(false));
            }
        };

        setQuestion(question);
    }

    return (
        <MainLayout title="Themes" breadcrumbNodes={ThemesBreadcrumbNodes}>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mb: 2,
                }}
            >
                <Button onClick={() => navigate("/app/themes/create")}>Add Theme</Button>
            </Box>
            <RevalidateTable integrityKey={integrityKey} revalidate={revalidate}>
                {(themes) => (
                    <Fragment>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th style={{ width: '50px' }} />
                        </tr>
                        </thead>
                        <tbody>
                        {themes.map((theme) => (
                            <tr key={theme.id}>
                                <td>
                                    <Link
                                        component={RouterLink}
                                        to={`/app/themes/${theme.id}/edit`}
                                        underline="hover"
                                        color="primary"
                                    >
                                        {theme.name}
                                    </Link>
                                </td>
                                <td>
                                    <Button
                                        variant="plain"
                                        color="neutral"
                                        size="sm"
                                        onClick={() => handleDelete(theme.id)}
                                        disabled={controlsLocked}
                                    >
                                        <DeleteForever />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Fragment>
                )}
            </RevalidateTable>
        </MainLayout>
    )
}