import type {PageArgs, PageResponse} from "./util.ts";

export type ActivityState = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface Activity {
    id: number;
    name: string;
    description: string;
    stepId: number;
    startDate: number;
    endDate: number;
    state: ActivityState;
}

export interface CreateActivityArgs {
    name: string;
    description: string;
    stepId: number;
    startDate: number;
    endDate: number;
}

export type CreateActivityResponse = Activity;

export interface ListActivitiesArgs extends PageArgs {
    /**
     * If assigned is true, only return activities assigned to the user.
     */
    assigned?: boolean;

    /**
     * If available is true, only return activities that are available to the user.
     */
    available?: boolean;

    /**
     * If stepId is provided, only return activities associated with the given step.
     */
    stepId?: number;
}

export type ListActivitiesResponse = PageResponse<Activity>;

export interface DeleteActivityArgs {
    activityId: number;
}

export type ActivityInspectAccessPrivilege = "CHANGE_STATE" | "ASSIGN_STAFF";

export interface InspectActivityArgs {
    activityId: number;
}

export interface InspectActivityResponse {
    activity: Activity;
    accessPrivileges: Record<ActivityInspectAccessPrivilege, boolean>;
}

export interface OpenActivityArgs {
    activityId: number;
}

export interface CloseActivityArgs {
    activityId: number;
    note?: {
        content: string;
    }
}

export interface AddUserToActivityArgs {
    activityId: number;
    userId: number;
}

export interface RemoveUserFromActivityArgs {
    activityId: number;
    userId: number;
}

export interface GetActivityArgs {
    activityId: number;
}

export type GetActivityResponse = Activity;