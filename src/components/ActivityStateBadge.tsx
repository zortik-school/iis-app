import type {ActivityState} from "../module/client/model/activity.ts";
import {Chip, type ChipProps} from "@mui/joy";

export interface ActivityStateBadgeProps extends ChipProps {
    state: ActivityState;
}

export const ActivityStateBadge = (
    {state, ...rest}: ActivityStateBadgeProps
) => {
    const getColor = () => {
        switch (state) {
            case 'OPEN':
                return 'success';
            case 'IN_PROGRESS':
                return 'warning';
            case 'CLOSED':
                return 'danger';
            default:
                return 'primary';
        }
    }

    return (
        <Chip size="sm" variant="soft" color={getColor()} {...rest}>
            {state}
        </Chip>
    )
}