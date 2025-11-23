import {RevalidateTable, type RevalidateTableProps} from "./RevalidateTable.tsx";
import {useState} from "react";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";
import type {Activity} from "../../module/client/model/activity.ts";
import {ActivityCard} from "../ActivityCard.tsx";
import Grid from "@mui/joy/Grid";

export interface ActivitiesTableProps {
    stepId?: number;
    assigned?: boolean;
    available?: boolean;
}

export const ActivitiesTable = (
    {stepId, assigned, available}: ActivitiesTableProps
) => {
    const gatewayCall = useGatewayCall();

    const [integrityKey] = useState<number>(0);

    const handleRevalidate: RevalidateTableProps<Activity>["revalidate"] = (pageIndex) => {
        return gatewayCall((gateway) => {
            return gateway.listActivities({
                stepId,
                assigned,
                available,
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
                            <ActivityCard activity={activity} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </RevalidateTable>
    )
}