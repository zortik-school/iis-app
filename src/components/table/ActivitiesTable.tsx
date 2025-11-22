import {RevalidateTable, type RevalidateTableProps} from "./RevalidateTable.tsx";
import {useState} from "react";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";
import type {Activity} from "../../module/client/model/activity.ts";
import {ActivityCard} from "../ActivityCard.tsx";
import Grid from "@mui/joy/Grid";

export interface ActivitiesTableProps {
    privileged: boolean;
    stepId?: number;
    assigned?: boolean;
}

export const ActivitiesTable = (
    {privileged, stepId, assigned}: ActivitiesTableProps
) => {
    const gatewayCall = useGatewayCall();

    const [integrityKey, setIntegrityKey] = useState<number>(0);

    const handleRevalidate: RevalidateTableProps<Activity>["revalidate"] = (pageIndex) => {
        return gatewayCall((gateway) => {
            return gateway.listActivities({
                stepId,
                assigned,
                page: {
                    index: pageIndex,
                    size: 10
                }
            })
        });
    }

    return (
        <RevalidateTable
            integrityKey={integrityKey}
            revalidate={handleRevalidate}
            useTable={false}
        >
            {(activities) => (
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    {activities.map((activity) => (
                        <Grid xs={4} key={activity.id}>
                            <ActivityCard
                                activity={activity}
                                privileged={privileged}
                                setIntegrityKey={setIntegrityKey}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </RevalidateTable>
    )
}