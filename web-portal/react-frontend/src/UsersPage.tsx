/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getUsers, UserData } from "./Data/User";
import { styled } from '@mui/material/styles';
import { UserList } from "./UsersList";
import { Button } from '@mui/material';
import { UserGrid } from './UsersGrid';
import { NewUserForm } from './NewUser';
import { BootstrapButton } from './BootstrapButton';


export const UsersPage = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [creatingNewUser, setCreatingNewUser] = useState(false);
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const doGetUsers = async() => {
            const accessToken = await getAccessTokenSilently();
            const users = await getUsers(accessToken);
            setUsers(users);
            setUsersLoading(false);
        };
        if (isAuthenticated) {
            doGetUsers();
        } else {
            console.log('The value of isAuthenticated is ' + isAuthenticated);
        }
    }, [isAuthenticated, creatingNewUser]);

    const addUser = () => {
        setCreatingNewUser(true);
    };

    const userAdded = (user: UserData) => {
        setCreatingNewUser(false);
    };

    return (
        <div>
            {usersLoading ? (
                <div
                css={css`
                    font-size: 16px;
                    font-style: italic;
                `}
                >
                Loading...
            </div>) : creatingNewUser ? (
                <NewUserForm userCreated={(user) => userAdded(user)} />
            ) : (
                <div>
                    <UserGrid data={users || []} />
                    <div>
                        <BootstrapButton variant="contained" color="primary" onClick={ () => { addUser(); } }>Add User</BootstrapButton>
                    </div>
                </div>
            )}
        </div>
    );
}