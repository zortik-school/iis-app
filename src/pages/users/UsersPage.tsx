import {MainLayout} from "../../components/layouts/MainLayout.tsx";
import {UsersBreadcrumbNodes} from "../../config/breadcrumbNodes.ts";
import {RevalidateTable, type RevalidateTableProps} from "../../components/table/RevalidateTable.tsx";
import type {Role, User} from "../../module/client/model/user.ts";
import {useGateway} from "../../module/client/hooks/useGateway.ts";
import {useCallback, useState} from "react";
import {Button, Dropdown, Menu, MenuButton, MenuItem} from "@mui/joy";
import {type Question, useConfirmModal} from "../../components/modal/ConfirmModalContext.tsx";
import { ArrowDropDown, DeleteForever } from "@mui/icons-material";
import {humanifyRole} from "../../module/shared/util/role.ts";
import {useAuth} from "../../module/auth/hooks/useAuth.ts";

export const UsersPage = () => {
    const {user} = useAuth();

    const gateway = useGateway();
    const {setQuestion} = useConfirmModal();

    const [usersIntegrityKey, setUsersIntegrityKey] = useState<number>(0);
    const [controlsLocked, setControlsLocked] = useState<boolean>(false);

    const isSelf = useCallback((userId: number) => {
        return user?.id === userId;
    }, [user]);

    const revalidateUsers: RevalidateTableProps<User>["revalidate"] = useCallback(async (page) => {
        return gateway.listUsers({
            page: {
                index: page,
                size: 10
            }
        });
    }, [gateway]);

    const handleDelete = (userId: number) => {
        const question: Question = {
            title: "Delete User?",
            message: "Are you sure you want to delete this user? This action cannot be undone.",
            onConfirm: () => {
                setControlsLocked(true);

                gateway
                    .deleteUser({ userId })
                    .then(() => setUsersIntegrityKey(Date.now()))
                    .finally(() => setControlsLocked(false));
            }
        }

        setQuestion(question);
    }

    const handleChangeRole = (userId: number, role: Role) => {
        setControlsLocked(true);

        gateway
            .changeUserRole({
                userId,
                role
            })
            .then(() => setUsersIntegrityKey(Date.now()))
            .finally(() => setControlsLocked(false));
    }

    return (
        <MainLayout
            title="Users"
            breadcrumbNodes={UsersBreadcrumbNodes}
        >
            <RevalidateTable
                integrityKey={usersIntegrityKey}
                revalidate={revalidateUsers}
            >
                {(items) => (
                    <>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th style={{ width: '50px' }} />
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.name}</td>
                                <td>
                                    <Dropdown>
                                        <MenuButton
                                            disabled={controlsLocked || isSelf(user.id)}
                                            endDecorator={<ArrowDropDown />}
                                            size="sm"
                                            sx={{
                                                textTransform: 'none',
                                                mx: 0,
                                            }}
                                        >{humanifyRole(user.role)}</MenuButton>
                                        <Menu>
                                            {(["ADMIN", "USER"] as Role[]).map((role) => {
                                                return (
                                                    <MenuItem
                                                        key={user.id + "-" + role}
                                                        onClick={() => handleChangeRole(user.id, role)}
                                                    >
                                                        {humanifyRole(role)}
                                                    </MenuItem>
                                                )
                                            })}
                                        </Menu>
                                    </Dropdown>
                                </td>
                                <td>
                                    <Button
                                        variant="plain"
                                        color="neutral"
                                        size="sm"
                                        onClick={() => handleDelete(user.id)}
                                        disabled={controlsLocked || isSelf(user.id)}
                                    >
                                        <DeleteForever />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </>
                )}
            </RevalidateTable>
        </MainLayout>
    )
}