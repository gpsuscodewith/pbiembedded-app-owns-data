import { FC } from "react";
import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { UserData, getUser, putUser } from './Data/User';
import { Button } from "@material-ui/core";
import { http } from './Data/http';
import { WorkspaceData, getWorkspaces } from './Data/Workspace';
import { WorkspaceUserData } from './Data/WorkspaceUser';
import { WorkspaceGrid } from "./WorkspaceGrid";

interface Props {
    ID: number;
}

export const ManageUser = ({ID}: Props) => {

  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0();

    const [message, setMessage] = React.useState<string>("");

    const [workspaces, setWorkspaces] = React.useState<Array<WorkspaceData>>([])
    const [userWorkspaces, setUserWorkspaces] = React.useState<Array<WorkspaceUserData>>([]);

    const [id, setId] = React.useState<number>(0);
    const [userId, setUserId] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [email, setEmail] = React.useState("");

    useEffect(() => {
        const doGetWorkspaces = async() => {
            const accessToken = await getAccessTokenSilently();
            const workspaces = await getWorkspaces(accessToken);
            setWorkspaces(workspaces);
        }

        const doGetUserWorkspaces = async() => {
          const accessToken = await getAccessTokenSilently();
        };

        const doGetUser = async(id: number) => {
            const accessToken = await getAccessTokenSilently();
            const user = await getUser(accessToken, id);
            
            if (user !== undefined) {
              console.log('retrieved the user from the backend');
              setId(id);
              setUserId(user.userId);
              setLastName(user.lastName);
              setFirstName(user.firstName);
              setEmail(user.email);
            }
            else {
              console.log('The user that was returned was undefined');
            }
        };

        if (isAuthenticated) {
            doGetUser(ID);
            doGetWorkspaces();
            doGetUserWorkspaces(); 
        }
    }, [isAuthenticated]);

    const updateUser = async () => {
      const accessToken = await getAccessTokenSilently();
      let user: UserData = {
        id: id,
        userId: userId,
        lastName: lastName,
        firstName: firstName,
        email: email
      };
      const result = await putUser(accessToken, user);
      if (result !== undefined) {
        setId(result.id);
        setUserId(result.userId);
        setLastName(result.lastName);
        setFirstName(result.firstName);
        setEmail(result.email);
      }      
    };

    return (
        <div>
          <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField id="userId" onChange={(event) => setUserId(event.target.value)} 
                label="User ID" variant="outlined" value={userId}  />
            <TextField id="lastName" onChange={(event) => setLastName(event.target.value)} 
                label="Last Name" variant="outlined" value={lastName}/>
            <TextField id="firstName" onChange={(event) => setFirstName(event.target.value)} 
                label="First Name" variant="outlined" value={firstName}/>
            <TextField id="email" onChange={(event) => setEmail(event.target.value)} 
                label="Email" variant="outlined" value={email}  />
          </Box>
          <Box>
            <WorkspaceGrid data={workspaces || []} />
          </Box>
        <Button variant="contained" onClick={ () => { updateUser(); } }>Submit</Button>
      </div>
    );
};