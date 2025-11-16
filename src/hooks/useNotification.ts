import {useContext} from "react";
import {NotificationContext} from "../components/notification/NotificationContext.ts";

export const useNotification = () => {
    return useContext(NotificationContext);
}