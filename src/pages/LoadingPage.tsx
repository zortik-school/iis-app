import {CenteredLayout} from "../components/layouts/CenteredLayout.tsx";
import {Spinner} from "../components/Spinner.tsx";

export const LoadingPage = () => {
    return (
        <CenteredLayout>
            <Spinner />
        </CenteredLayout>
    )
}