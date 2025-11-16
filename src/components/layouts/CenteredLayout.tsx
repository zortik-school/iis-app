import type {PropsWithChildren} from "react";

export type CenteredLayoutProps = PropsWithChildren;

export const CenteredLayout = (
    {children}: CenteredLayoutProps
) => {
    // TODO
    return (
        <div className="flex flex-col justify-center items-center min-h-screen gap-4">
            {children}
        </div>
    )
}