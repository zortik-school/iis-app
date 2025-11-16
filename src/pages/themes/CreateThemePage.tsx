import {FormControl, FormLabel, Input, Button, Box} from "@mui/joy";
import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {CreateThemeBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {type SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useGatewayCall} from "../../module/client/hooks/useGatewayCall.ts";

type FormInputs = {
    themeName: string;
    themeDescription: string;
}

export const CreateThemePage = () => {
    const callGateway = useGatewayCall();
    const navigate = useNavigate();

    const {handleSubmit, register} = useForm<FormInputs>();
    const [controlsDisabled, setControlsDisabled] = useState<boolean>(false);

    const onSubmitValid: SubmitHandler<FormInputs> = (data) => {
        setControlsDisabled(true);

        callGateway((gateway) => {
            return gateway.createTheme({
                name: data.themeName,
                description: data.themeDescription
            })
        }).then(() => {
            navigate("/app/themes");
        }).finally(() => {
            setControlsDisabled(false);
        });
    }

    return (
        <MainLayout title="Create Theme" breadcrumbNodes={CreateThemeBreadcrumbNodes}>
            <form
                onSubmit={handleSubmit(onSubmitValid)}
                className="flex flex-col"
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel>Theme name</FormLabel>
                        <Input
                            type="text"
                            placeholder="Gorgeous theme" required {...register("themeName")} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Theme description</FormLabel>
                        <Input
                            type="text"
                            placeholder="A really gorgeous theme" required {...register("themeDescription")} />
                    </FormControl>
                </Box>

                <Button
                    type="submit"
                    sx={{ mt: 1 }}
                    disabled={controlsDisabled}
                    loading={controlsDisabled}
                >Create</Button>
            </form>
        </MainLayout>
    )
}