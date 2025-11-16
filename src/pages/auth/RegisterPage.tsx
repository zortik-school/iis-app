import {CenteredDialogLayout} from "../../components/layouts/CenteredDialogLayout.tsx";
import {useAuth} from "../../module/auth/hooks/useAuth.ts";
import {useNavigate, Link as RouterLink, Navigate} from "react-router-dom";
import {type SubmitHandler, useForm} from "react-hook-form";
import {Button, FormControl, FormLabel, Input, Link as JoyLink, Typography} from "@mui/joy";

type Inputs = {
    username: string;
    name: string;
    password: string;
}

export const RegisterPage = () => {
    const {register, pendingOperation, error, user} = useAuth();
    const navigate = useNavigate();

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const handleFormSubmit: SubmitHandler<Inputs> = (data) => {
        register({
            username: data.username,
            password: data.password,
            name: data.name
        }).then(() => {
            navigate("/");
        });
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <CenteredDialogLayout title="Register" subtitle="Create an account to get started.">
            {error && <Typography color="danger">Auth error: {error.message}</Typography>}

            <form onSubmit={handleSubmit(handleFormSubmit)} className="gap-y-4 flex flex-col">
                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                        type="text"
                        placeholder="john_doe"

                        {...registerField("username")}

                        required
                    />
                    {errors.username && <Typography>{errors.username.message}</Typography>}
                </FormControl>
                <FormControl>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                        type="text"
                        placeholder="Full Name"

                        {...registerField("name")}

                        required
                    />
                    {errors.name && <Typography>{errors.name.message}</Typography>}
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        placeholder="password"

                        {...registerField("password")}

                        required
                    />
                    {errors.password && <Typography>{errors.password.message}</Typography>}
                </FormControl>
                <Button
                    type="submit"
                    sx={{ mt: 1 }}
                    disabled={pendingOperation}
                    loading={pendingOperation}
                >Login</Button>

                <Typography
                    endDecorator={<JoyLink to="/auth/login" component={RouterLink}>Login now!</JoyLink>}
                    level="body-sm"
                    sx={{ mt: 1, textAlign: 'center' }}
                >
                    Already have an account?
                </Typography>
            </form>
        </CenteredDialogLayout>
    )
}