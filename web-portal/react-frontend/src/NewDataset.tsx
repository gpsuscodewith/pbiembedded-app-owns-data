/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { styled } from '@mui/material/styles';
import { BootstrapButton } from './BootstrapButton';
import { TenantData, getTenants } from './Data/Tenant';
import { getWorkspaces, WorkspaceData } from './Data/Workspace';
import { WorkspaceUserData } from './Data/WorkspaceUser';
import { postDataset } from './Data/Dataset';
import { UserData, getMe } from './Data/User';
import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import { DatasetData } from './Data/Dataset';

interface Props {
    user: UserData;
    tenants: TenantData[];
    workspaces: WorkspaceData[];
    userWorkspaces: WorkspaceUserData[];
 //   addWorkspace: (id: number) => void;
 //   removeWorkspace: (id: number) => void;
}

export const NewDataset = () => {
    const { getAccessTokenSilently } = useAuth0();

    const [isLoading, setIsLoadting] = React.useState<boolean>(true);
    const [user, setUser] = React.useState<UserData | undefined>(undefined);
    const [tenants, setTenants] = React.useState<TenantData[]>([]);
    const [workspaces, setWorkspaces] = React.useState<WorkspaceData[]>([]);
    const [selectedTenantId, setSelectedTenantId] = React.useState<number>(0);
    const [tenantWorkspaces, setTenantWorkspaces] = React.useState<WorkspaceData[]>([]);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = React.useState<number>(0);
    const [datasetName, setDatasetName] = React.useState<string>("");

    useEffect(() => {
        const getWorkspacesForTenant = () => {
            const filtered = workspaces.filter(x => x.tenantId === selectedTenantId);
            setTenantWorkspaces(filtered);
        };
        const doGetMe = async() => {
            const accessToken = await getAccessTokenSilently();
            const user = await getMe(accessToken);
            setUser(user);
        };
        const doGetTenants = async() => {
            const accessToken = await getAccessTokenSilently();
            const tenants = await getTenants(accessToken);
            setTenants(tenants);
        };
        const doGetWorkspaces = async() => {
            const accessToken = await getAccessTokenSilently();
            const workspaces = await getWorkspaces(accessToken);
            setWorkspaces(workspaces);
            setIsLoadting(false);
        };

        doGetMe();
        doGetTenants();
        doGetWorkspaces();

    }, [selectedTenantId, selectedWorkspaceId]);

    const handleTenantChange = (selectedValue: number) => {
        console.log(`Inside handleTenantChange with a value of ${selectedValue}`);
        setSelectedTenantId(selectedValue);
    };

    const handleWorkspaceChange = (selectedValue: number) => {
        console.log(`Inside handleWorkspaceChange with a value of ${selectedValue}`);
        setSelectedWorkspaceId(selectedValue);
    };

    const createDataset = async () => {
        try {
            const selectedWorkspaces: WorkspaceData[] = workspaces.filter(x => x.id === selectedWorkspaceId);
            if (selectedWorkspaces !== undefined 
                && selectedWorkspaces.length === 1) {
                    let dataSet: DatasetData = {
                        id: 0,
                        tenantId: selectedTenantId,
                        workspaceId: selectedWorkspaceId,
                        pbiWorkspace: selectedWorkspaces[0].pbiIdentifier,
                        dataSetName: datasetName,
                        createdBy: user?.userId
                    };
                    const token = await getAccessTokenSilently();
                    const result = await postDataset(token, dataSet);
            }            
        } catch (e: any) {
            console.log(e);
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
                    value={selectedTenantId}
                    onChange={(event) => handleTenantChange(event.target.value as number)}
                >
                    {tenants?.map(tenant => {
                        return (
                            <MenuItem key={tenant.id} value={tenant.id}>
                                {tenant.tenantName}
                            </MenuItem>
                        );
                    })}
                </Select>
            </Box>
            <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            >
                <Select
                    name="workspace"
                    value={selectedWorkspaceId}
                    onChange={(event) => handleWorkspaceChange(event.target.value as number)}
                >
                    {workspaces?.map(workspace => {
                        return (
                            <MenuItem key={workspace.id} value={workspace.id}>
                                {workspace.workspaceName}
                            </MenuItem>
                        );
                    })}
                </Select>
            </Box>

            <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            >
            <TextField id="datasetName" onChange={(event) => setDatasetName(event.target.value)} label="Dataset Name" variant="outlined" />
            </Box>
            <Button variant="contained" onClick={ () => { createDataset(); } }>Submit</Button>
        </Box>
    );
};