import type {Role} from "../../client/model/user.ts";

/**
 * Converts a role identifier to a human-readable format.
 *
 * @param role The role identifier.
 */
export const humanifyRole = (role: Role) => {
    switch (role) {
        case "ADMIN":
            return "Administrator";
        case "CAMPAIGN_MANAGER":
            return "Campaign Manager";
        case "STEP_MANAGER":
            return "Step Manager";
        case "ACTIVITY_EXECUTOR":
            return "Activity Executor";
        case "USER":
            return "User";
        default:
            return role;
    }
}