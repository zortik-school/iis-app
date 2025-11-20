import {type Dispatch, useCallback, useEffect, useState} from "react";
import type {User} from "../module/client/model/user.ts";
import {Autocomplete, type AutocompleteProps} from "@mui/joy";
import {useGatewayCall} from "../module/client/hooks/useGatewayCall.ts";
import {Spinner} from "./Spinner.tsx";

type AutoCompletePropsOmit = Omit<AutocompleteProps<User, false, false, false>,
    'options'
    | 'value'
    | 'onChange'
    | 'inputValue'
    | 'onInputChange'
    | 'loading'
    | 'open'
    | 'onOpen'
    | 'onClose'
    | 'getOptionLabel'
    | 'isOptionEqualToValue'>

export interface UserSelectorProps extends AutoCompletePropsOmit {
    /**
     * The currently selected user or user ID.
     */
    selected?: User|number;

    /**
     * Callback invoked when a user is selected.
     *
     * @param user The selected user.
     */
    onSelected?: Dispatch<User|undefined>;
}

export const UserSelector = (
    {selected, onSelected, ...rest}: UserSelectorProps
) => {
    const gatewayCall = useGatewayCall();

    const [inputValue, setInputValue] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<User|null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [options, setOptions] = useState<User[]>([]);

    useEffect(() => {
        (async () => {
            if (typeof selected === "object") {
                return selected;
            }

            if (selected === undefined) {
                return undefined;
            }

            return gatewayCall((gateway) => gateway.getUser({ userId: selected }));
        })()
            .then((user) => setSelectedUser(user ?? null))
            .catch(() => setSelectedUser(null));
    }, [selected, gatewayCall]);

    const freshenOptions = useCallback((input: string) => {
        if (loading) {
            return;
        }

        setLoading(true);

        gatewayCall((gateway) => {
            return gateway.queryUsers({
                query: input,
                page: {
                    index: 0,
                    size: 20,
                },
            })
        })
            .then((res) => setOptions(res.items))
            .finally(() => setLoading(false));
    }, [gatewayCall, loading]);

    return (
        <Autocomplete
            value={selectedUser}
            onChange={(_, newValue) => {
                onSelected?.(newValue || undefined);
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);

                freshenOptions(newInputValue);
            }}
            sx={{ width: 300 }}
            placeholder="Select User"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) => option.id == value.id}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            endDecorator={
                loading ? <Spinner /> : null
            }

            {...rest}
        />
    )
}