/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { WorkspaceData, getWorkspaces } from "./Data/Workspace";
import { styled } from '@mui/material/styles';
import { NewTenantForm } from './NewTenant';
import { BootstrapButton } from './BootstrapButton';
import { TenantGrid } from './TenantGrid';
import { NewWorkspaceForm } from './NewWorkspaceForm';
import { WorkspaceGrid } from './WorkspaceGrid';

export const WorkspacePage = () => {
    const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([]);
    const [workspacesLoading, setWorkspacesLoading] = useState(true);
    const [creatingNewWorkspace, setCreatingNewWorkspace] = useState(false);
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const doGetWorkspaces = async() => {
            const accessToken = await getAccessTokenSilently();
            const workspaces = await getWorkspaces(accessToken);
            setWorkspaces(workspaces);
            setWorkspacesLoading(false);
        };
        if (isAuthenticated) {
            doGetWorkspaces();
        } else {
            console.log(`The value of isAuthenticated in TenantsPage useEffect() is ${isAuthenticated}`);
        }
    }, [isAuthenticated, creatingNewWorkspace]);

    const addWorkspace = () => {
        setCreatingNewWorkspace(true);
    };

    const workspaceAdded = (workspace: WorkspaceData) => {
        setCreatingNewWorkspace(false);
    };

    return (
        <div>
            {workspacesLoading ? (
                <div
                css={css`
                    font-size: 16px;
                    font-style: italic;
                `}
                >
                Loading...
            </div>) : creatingNewWorkspace ? (
                <NewWorkspaceForm workspaceCreated={(workspace) => workspaceAdded(workspace)} />
            ) : (
                <div>
                    <WorkspaceGrid data={workspaces || []} />
                    <div>
                        <BootstrapButton variant="contained" color="primary" onClick={ () => { addWorkspace(); } }>Add Workspace</BootstrapButton>
                    </div>
                </div>
            )}
        </div>
    );
};