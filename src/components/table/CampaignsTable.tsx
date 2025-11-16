import {RevalidateTable, type RevalidateTableProps} from "./RevalidateTable.tsx";
import {useAuth} from "../../module/auth/hooks/useAuth.ts";
import {useEffect, useState} from "react";

export const CampaignsTable = () => {
    const {user} = useAuth();

    const [integrityKey, setIntegrityKey] = useState<number>(0);
    const [privileged, setPrivileged] = useState<boolean>(false);

    useEffect(() => {
        (() => {
            setPrivileged(user!.privileges.includes("MANAGE_THEMES"));
        })();
    }, [user]);

    return (
        <RevalidateTable integrityKey={integrityKey} revalidate={}>

        </RevalidateTable>
    )
}