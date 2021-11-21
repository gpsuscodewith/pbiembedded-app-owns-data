/* eslint-disable no-restricted-globals */
import { FC } from "react";
import React, { useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import TextField from '@mui/material/TextField';
import { WorkspaceData, postWorkspace } from './Data/Workspace';
import { Button } from "@material-ui/core";
import { http } from './Data/http';
import { getTenants, TenantData } from './Data/Tenant'; 

interface Props {
    workspaceCreated: (workspace: WorkspaceData) => void;
}

export const NewWorkspaceForm = ({workspaceCreated}: Props) => {
    const [message, setMessage] = React.useState("");

    const [workspaceName, setWorkspaceName] = React.useState("");
    const [workspaceLocation, setWorkspaceLocation] = React.useState("");
    const [pbiIdentifier, setPbiIdentifier] = React.useState("");
    const [tenantId, setTenantId] = React.useState(0);
    const [tenants, setTenants] = React.useState<TenantData[]>([]);

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const doGetTenants = async() => {
            const accessToken = await getAccessTokenSilently();
            const tenants = await getTenants(accessToken);
            setTenants(tenants);
        };
        if (isAuthenticated) {
            doGetTenants();
        } else {
            console.log(`The value of isAuthenticated is ${isAuthenticated} in NewWorkspaceForm`);
        }
    }, [isAuthenticated]);

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

    const handleChange = (selectedValue: number) => {
        console.log(`Inside handleChange with a value of ${selectedValue}`);
        setTenantId(selectedValue);
    };
/*
    const handleFocus = () => {
        if (onfocus) {
            onfocus();
        }
    };

    const handleBlur = (e: { target: { value: FocusEvent; }; }) => {
        if (onblur) {
  //          onblur(e.target.value);
        }
    };
*/
    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >

          <Select
            name="tenant"
            value={tenantId}
            onChange={(event) => handleChange(event.target.value as number)}
          >
              {tenants?.map(tenant => {
                  return (
                    <MenuItem key={tenant.id} value={tenant.id}>
                        {tenant.tenantName}
                    </MenuItem>
                  );
              })}
          </Select>
          <TextField id="workspaceName" onChange={(event) => setWorkspaceName(event.target.value)} label="Workspace Name" variant="outlined" />
          <TextField id="workspaceLocation" onChange={(event) => setWorkspaceLocation(event.target.value)} label="Workspace Location" variant="outlined" />
          <TextField id="pbiIdentifier" onChange={(event) => setPbiIdentifier(event.target.value)} label="Power Bi Identifier" variant="outlined" />
          <Button variant="contained" onClick={ () => { createWorkspace(); } }>Submit</Button>
        </Box>
        );
};