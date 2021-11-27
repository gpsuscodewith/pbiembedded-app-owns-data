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

export const ManageDataset = ({ID}: Props) => {
    const {
        isLoading,
        isAuthenticated,
        error,
        user,
        loginWithRedirect,
        logout,
        getAccessTokenSilently
      } = useAuth0();
    
    const [workspaces, setWorkspaces] = React.useState<Array<WorkspaceData>>([])
    
    return (
        <div>
            
        </div>
    );
};