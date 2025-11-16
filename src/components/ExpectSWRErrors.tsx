import useSWR from "swr";
import {type PropsWithChildren, useEffect, useState} from "react";
import {CenteredLayout} from "./layouts/CenteredLayout.tsx";
import {Typography} from "@mui/joy";

export interface ExpectSWRErrorsProps extends PropsWithChildren {
    errors: Parameters<typeof useSWR>[2][],
}

export const ExpectSWRErrors = (
    {errors, children}: ExpectSWRErrorsProps
) => {
    const [anyError, setAnyError] = useState<Error | undefined>(undefined);

    useEffect(() => {
        (() => {
            setAnyError(errors.find(error => error instanceof Error));
        })();
    }, [errors]);

    return anyError ? (
        <CenteredLayout>
            <Typography>An unexpected error occured.</Typography>
        </CenteredLayout>
    ) : (
        children
    );
}