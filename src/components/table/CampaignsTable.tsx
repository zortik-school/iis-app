import {RevalidateTable, type RevalidateTableProps} from "./RevalidateTable.tsx";
import {useAuth} from "../../module/auth/hooks/useAuth.ts";
import {Fragment, useEffect, useState} from "react";
import type {Campaign} from "../../module/client/model/campaign.ts";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";
import {DeleteForever} from "@mui/icons-material";
import {Button, Link} from "@mui/joy";
import {Link as RouterLink} from "react-router";
import {type Question, useConfirmModal} from "../modal/ConfirmModalContext.tsx";
import {ThemeLink} from "../ThemeLink.tsx";

export interface CampaignsTableProps {
    themeId?: number;
    assigned?: boolean;
}

export const CampaignsTable = (
    {themeId, assigned}: CampaignsTableProps
) => {
    const gatewayCall = useGatewayCall();
    const {user} = useAuth();
    const {setQuestion} = useConfirmModal();

    const [integrityKey, setIntegrityKey] = useState<number>(0);
    const [privileged, setPrivileged] = useState<boolean>(false);
    const [controlsLocked, setControlsLocked] = useState<boolean>(false);

    useEffect(() => {
        (() => {
            setPrivileged(user!.privileges.includes("MANAGE_CAMPAIGNS"));
        })();
    }, [user]);

    const handleRevalidate: RevalidateTableProps<Campaign>["revalidate"] = (pageIndex) => {
        return gatewayCall((gateway) => {
            return gateway.listCampaigns({
                themeId,
                assigned,
                page: {
                    index: pageIndex,
                    size: 10
                }
            })
        });
    }

    const handleDelete = (id: number) => {
        const question: Question = {
            title: "Delete Campaign?",
            message: "Are you sure you want to delete this campaign? This action cannot be undone.",
            onConfirm: () => {
                setControlsLocked(true);

                gatewayCall((gateway) => gateway.deleteCampaign({ campaignId: id }))
                    .then(() => setIntegrityKey(Date.now()))
                    .finally(() => setControlsLocked(false));
            }
        };

        setQuestion(question);
    }

    return (
        <RevalidateTable integrityKey={integrityKey} revalidate={handleRevalidate}>
            {(campaigns) => (
                <Fragment>
                    <thead>
                    <tr>
                        <th>Name</th>
                        {privileged && <th>Theme</th>}
                        {privileged && <th style={{ width: '50px' }} />}
                    </tr>
                    </thead>
                    <tbody>
                    {campaigns.map((campaign) => (
                        <tr key={campaign.id}>
                            <td>
                                <Link
                                    component={RouterLink}
                                    to={`/app/campaigns/${campaign.id}/edit`}
                                    underline="hover"
                                    color="primary"
                                >
                                    {campaign.name}
                                </Link>
                            </td>
                            {privileged && (
                                <td><ThemeLink themeId={campaign.themeId}>{campaign.themeId}</ThemeLink></td>
                            )}
                            {privileged && (
                                <td>
                                    <Button
                                        variant="plain"
                                        color="neutral"
                                        size="sm"
                                        onClick={() => handleDelete(campaign.id)}
                                        disabled={controlsLocked}
                                    >
                                        <DeleteForever />
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </Fragment>
            )}
        </RevalidateTable>
    )
}