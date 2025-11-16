import {createContext} from "react";

export interface NotificationContextData {
    notification?: string;

    setNotification: (notification: string|undefined) => void;
}

const createDefaultContextData = (): NotificationContextData => {
    return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setNotification: (_notification: string|undefined) => {
            throw new Error("Not implemented");
        }
    }
}

export const NotificationContext = createContext<NotificationContextData>(createDefaultContextData());