import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";
import {useAuth} from "../../module/auth/hooks/useAuth.ts";
import {type Question, useConfirmModal} from "../modal/ConfirmModalContext.tsx";
import {Fragment, useEffect, useState} from "react";
import {RevalidateTable, type RevalidateTableProps} from "./RevalidateTable.tsx";
import {Button, Link} from "@mui/joy";
import {Link as RouterLink} from "react-router";
import {ThemeLink} from "../ThemeLink.tsx";
import {DeleteForever} from "@mui/icons-material";
import type {CampaignStep} from "../../module/client/model/step.ts";
import {StepLink} from "../StepLink.tsx";

export interface CampaignStepsTableProps {
    assigned?: boolean;
}

export const CampaignStepsTable = (
    {assigned}: CampaignStepsTableProps
) => {
    const gatewayCall = useGatewayCall();
    const {user} = useAuth();
    const {setQuestion} = useConfirmModal();

    const [integrityKey, setIntegrityKey] = useState<number>(0);
    const [privileged, setPrivileged] = useState<boolean>(false);
    const [controlsLocked, setControlsLocked] = useState<boolean>(false);

    useEffect(() => {
        (() => {
            setPrivileged(user!.privileges.includes("MANAGE_STEPS"));
        })();
    }, [user]);

    const handleRevalidate: RevalidateTableProps<CampaignStep>["revalidate"] = (pageIndex) => {
        return gatewayCall((gateway) => {
            return gateway.listCampaignSteps({
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
            title: "Delete Step?",
            message: "Are you sure you want to delete this campaign step? This action cannot be undone.",
            onConfirm: () => {
                setControlsLocked(true);

                /*gatewayCall((gateway) => gateway.deleteCampaign({ campaignId: id }))
                    .then(() => setIntegrityKey(Date.now()))
                    .finally(() => setControlsLocked(false));*/ // TODO
            }
        };

        setQuestion(question);
    }

    return (
        <RevalidateTable integrityKey={integrityKey} revalidate={handleRevalidate}>
            {(steps) => (
                <Fragment>
                    <thead>
                    <tr>
                        <th>Name</th>
                        {privileged && <th>Campaign</th>}
                        {privileged && <th style={{ width: '50px' }} />}
                    </tr>
                    </thead>
                    <tbody>
                    {steps.map((step) => (
                        <tr key={step.id}>
                            <td>
                                <StepLink stepId={step.id}>{step.name}</StepLink>
                            </td>
                            {privileged && (
                                <td><ThemeLink themeId={step.campaignId}>{step.campaignId}</ThemeLink></td>
                            )}
                            {privileged && (
                                <td>
                                    <Button
                                        variant="plain"
                                        color="neutral"
                                        size="sm"
                                        onClick={() => handleDelete(step.id)}
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