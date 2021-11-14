import { FC } from "react";
import * as React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { WorkspaceData, postWorkspace } from './Data/Workspace';
import { Button } from "@material-ui/core";
import { http } from './Data/http';

interface Props {
    workspaceCreated: (workspace: WorkspaceData) => void;
}

export const NewWorkspaceForm = ({workspaceCreated}: Props) => {
    const [message, setMessage] = React.useState("");

    const [workspaceName, setWorkspaceName] = React.useState("");
    const [workspaceLocation, setWorkspaceLocation] = React.useState("");
    const [pbiIdentifier, setPbiIdentifier] = React.useState("");
    const [tenantId, setTenantId] = React.useState(0);

    const { getAccessTokenSilently } = useAuth0();

    const createWorkspace = async () => {
        try {
            let workspaceData: WorkspaceData = {
                id: 0,
                workspaceName: workspaceName,
                workspaceLocation: workspaceLocation,
                pbiIdentifier: pbiIdentifier,
                tenantId: tenantId
            };
            
            const token = await getAccessTokenSilently();
            const result = await postWorkspace(token, workspaceData);
            if (result !== undefined) {
                workspaceCreated(result);
            }
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
          <TextField id="workspaceName" onChange={(event) => setWorkspaceName(event.target.value)} label="Workspace Name" variant="outlined" />
          <TextField id="workspaceLocation" onChange={(event) => setWorkspaceLocation(event.target.value)} label="Workspace Location" variant="outlined" />
          <TextField id="pbiIdentifier" onChange={(event) => setPbiIdentifier(event.target.value)} label="Power Bi Identifier" variant="outlined" />
          <TextField id="tenantId" onChange={(event) => setTenantId(+event.target.value)} label="Tenant ID" variant="outlined" />
          <Button variant="contained" onClick={ () => { createWorkspace(); } }>Submit</Button>
        </Box>
        );
};