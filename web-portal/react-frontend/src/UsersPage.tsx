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

const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    position: 'relative',
    left: '50%',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    color: 'Background',
    backgroundColor: '#0063cc',
    borderColor: '#0063cc',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  });

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