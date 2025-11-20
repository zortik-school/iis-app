import useSWR from "swr";
import {type PropsWithChildren, useEffect, useState} from "react";
import {CenteredLayout} from "./layouts/CenteredLayout.tsx";
import {Typography} from "@mui/joy";

export interface ExpectSWRErrorsProps extends PropsWithChildren {
    errors: Parameters<typeof useSWR>[2][],
    customErrorMessageFunc?: (error: Error) => string|undefined,
}

export const ExpectSWRErrors = (
    {errors, customErrorMessageFunc, children}: ExpectSWRErrorsProps
) => {
    const [anyError, setAnyError] = useState<Error | undefined>(undefined);
    const [customErrorMessage, setCustomErrorMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        (() => {
            const errorFound = errors.find(error => error instanceof Error);

            setAnyError(errorFound);
            setCustomErrorMessage(() => {
                if (customErrorMessageFunc && errorFound) {
                    return customErrorMessageFunc(errorFound);
                }
            });
        })();
    }, [customErrorMessageFunc, errors]);

    return anyError ? (
        <CenteredLayout>
            <Typography>{customErrorMessage ?? "An unexpected error occured."}</Typography>
        </CenteredLayout>
    ) : (
        children
    );
}