import {CenteredDialogLayout} from "../../components/layouts/CenteredDialogLayout.tsx";
import {Button, FormControl, FormLabel, Input, Link as JoyLink, Typography} from "@mui/joy";
import {useAuth} from "../../module/auth/hooks/useAuth.ts";
import {type SubmitHandler, useForm} from "react-hook-form";
import {useNavigate, Link as RouterLink, Navigate} from "react-router-dom";

type Inputs = {
    username: string;
    password: string;
}

export const LoginPage = () => {
    const {login, pendingOperation, error, user} = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const handleFormSubmit: SubmitHandler<Inputs> = (data) => {
        login({
            username: data.username,
            password: data.password
        }).then(() => {
            navigate("/");
        });
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <CenteredDialogLayout title="Login" subtitle="Please enter your credentials to log in.">
            {error && <Typography color="danger">Auth error: {error.message}</Typography>}

            <form onSubmit={handleSubmit(handleFormSubmit)} className="gap-y-4 flex flex-col">
                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                        type="text"
                        placeholder="john_doe"

                        {...register("username")}

                        required
                    />
                    {errors.username && <Typography>{errors.username.message}</Typography>}
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        placeholder="password"

                        {...register("password")}

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
                    endDecorator={<JoyLink to="/auth/register" component={RouterLink}>Register now!</JoyLink>}
                    level="body-sm"
                    sx={{ mt: 1, textAlign: 'center' }}
                >
                    Don't have an account?
                </Typography>
            </form>
        </CenteredDialogLayout>
    )
}