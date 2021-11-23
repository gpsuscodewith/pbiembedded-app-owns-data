import { FC } from "react";
import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { UserData, getUser, putUser } from './Data/User';
import { Button } from "@material-ui/core";
import { http } from './Data/http';
import { WorkspaceData, getWorkspaces } from './Data/Workspace';
import { WorkspaceUserData, getWorkspacesForUser } from './Data/WorkspaceUser';
import { WorkspaceGrid } from "./WorkspaceGrid";
import { UserGroups } from './UserGroups';
import { processUserWorkspaceUpdates } from './Data/UserProcessor';
import { UnitOfWork } from "./Data/UnitOfWork";

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

    const [addedWorkgroups, setAddedWorkgroups] = React.useState<number[]>([]);
    const [removedWorkgroups, setRemovedWorkgroups] = React.useState<number[]>([]);

    useEffect(() => {
        const doGetWorkspaces = async() => {
            const accessToken = await getAccessTokenSilently();
            const workspaces = await getWorkspaces(accessToken);
            setWorkspaces(workspaces);
        }

        const doGetUserWorkspaces = async(id: number) => {
          console.log(`Inside doGetUserWorkspaces with an id value of ${id}`);
          const accessToken = await getAccessTokenSilently();
          const userWorkspaces = await getWorkspacesForUser(accessToken, id);
          console.log(`Returned from call to getWorkspacesForUser with a length of ${userWorkspaces.length}`);
          console.log(`The total value of userWorkspaces is ${userWorkspaces}`);
          userWorkspaces.map(x => console.log(`Inside userWorkspaces.map with a workspaceid od ${x.workspaceId}`));
          setUserWorkspaces(userWorkspaces);
        };

        const doGetUser = async(id: number) => {
            console.log(`Inside doGetUser with an id value of ${id}`);
            const accessToken = await getAccessTokenSilently();
            const user = await getUser(accessToken, id);
            
            if (user !== undefined) {
              console.log('retrieved the user from the backend');
              setId(id);
              console.log(`called setId with an id of ${id}`);
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
            console.log(`isAuthenticated has passed and the value of ID is ${ID}`);
            doGetUser(ID);
            doGetWorkspaces();
            doGetUserWorkspaces(ID); 
        }
    }, [isAuthenticated]);

    const updateUser = async () => {
      const accessToken = await getAccessTokenSilently();
      const user = assembleUser();
      const result = await putUser(accessToken, user);
      
      if (result !== undefined) {
        saveUserState(user);
      }
      
      await updateUserGroups();
    };

    const updateUserGroups = async () => {
      console.log(`Inside updateUserGroups`);
      const accessToken = await getAccessTokenSilently();
      const uow: UnitOfWork<number> = {
        adds: addedWorkgroups,
        deletes: removedWorkgroups
      };

      const processorResults = await processUserWorkspaceUpdates(accessToken, id, uow);
      if (!processorResults.isSuccessful) {
        console.log(`The call to processUserWorkspaceUpdates was unsuccessful with an error message of ${processorResults.errorMessage}`);
      } else {
        console.log('The call to processUserWorkspaceUpdates was successful.');
      }
    };

    const assembleWorkspacesForUser = (): WorkspaceData[] => {
      return workspaces.filter(x => userWorkspaces.some(e => e.workspaceId === x.id));
    };

    const saveUserState = (user: UserData) => {
        setId(user.id);
        setUserId(user.userId);
        setLastName(user.lastName);
        setFirstName(user.firstName);
        setEmail(user.email);
    };

    const assembleUser = (): UserData => {
      let assembledUser: UserData = {
        id: id,
        userId: userId,
        lastName: lastName,
        firstName: firstName,
        email: email
      };
      return assembledUser;
    };

    const handleAddWorkspace = (id: number) => {
      const addedIndex = addedWorkgroups.indexOf(id);
      if (addedIndex === -1) {
        const newAddWorkgroups = [...addedWorkgroups];
        newAddWorkgroups.push(id);
        setAddedWorkgroups(newAddWorkgroups);
      }

      const removedIndex = removedWorkgroups.indexOf(id);
      if (removedIndex !== -1) {
        const newRemovedWorkgroups = [...removedWorkgroups];
        newRemovedWorkgroups.splice(removedIndex, 1);
        setRemovedWorkgroups(newRemovedWorkgroups);
      }
    };

    const handleRemoveWorkspace = (id: number) => {
      const removedIndex = removedWorkgroups.indexOf(id);
      if (removedIndex === -1) {
        const newRemovedWorkgroups = [...removedWorkgroups];
        newRemovedWorkgroups.push(id);
        setRemovedWorkgroups(newRemovedWorkgroups);
      }

      const addedIndex = addedWorkgroups.indexOf(id);
      if (addedIndex !== -1) {
        const newAddedWorkgroups = [...addedWorkgroups];
        newAddedWorkgroups.splice(addedIndex, 1);
        setAddedWorkgroups(newAddedWorkgroups);
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
          <div>{firstName}'s Workspaces</div>
          <div>
            <UserGroups 
              user={assembleUser()} 
              workspaces={workspaces} 
              userWorkspaces={userWorkspaces} 
              addWorkspace={(id) => handleAddWorkspace(id)} 
              removeWorkspace={(id) => handleRemoveWorkspace(id)}></UserGroups>
          </div>
          <Button variant="contained" onClick={ () => { updateUser(); } }>Submit</Button>
      </div>
    );
};