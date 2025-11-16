import {type PropsWithChildren, useState} from "react";
import {NotificationContext, type NotificationContextData} from "./NotificationContext.ts";

export type NotificationProviderProps = PropsWithChildren;

export const NotificationProvider = (
    {children}: NotificationProviderProps
) => {
    const [notification, setNotification] = useState<string|undefined>(undefined);

    const data: NotificationContextData = {
        notification,
        setNotification,
    }
    return (
        <NotificationContext.Provider value={data}>
            {children}
        </NotificationContext.Provider>
    )
}