import { wait, waitFor } from "@testing-library/dom";
import { http } from "./http";

export interface WorkspaceData {
    id: number;
    workspaceLocation: string;
    workspaceName: string;
    pbiIdentifier: string;
    tenantId: number;
}

export interface WorkspaceDataFromServer {
    id: number;
    workspaceLocation: string;
    workspaceName: string;
    pbiIdentifier: string;
    tenantId: number;
}

const mapWorkspaceDataFromServer = (
    workspace: WorkspaceDataFromServer,
) : WorkspaceData => ({
    ...workspace
});

export const getWorkspaces = async(accessToken: string): Promise<WorkspaceData[]> => {
    console.log(`Inside getTenants with an accessToken of ${accessToken}`);
    const result = await http<WorkspaceDataFromServer[]>({
        path: '/workspaces',
        accessToken: accessToken
    }); 
    console.log('After call to /workspaces');
    if (result.ok && result.body) {
        return result.body.map(mapWorkspaceDataFromServer);
    } else {
        return [];
    }
};

export const postWorkspace = async(accessToken: string, workspace: WorkspaceData): Promise<WorkspaceData | undefined> => {
    console.log('Inside postTenant with an accessToken of ' + accessToken);
    const result = await http<WorkspaceDataFromServer, WorkspaceData>({
        path: '/workspaces',
        method: 'post',
        body: workspace,
        accessToken: accessToken
    });
    if (result.ok && result.body) {
        return mapWorkspaceDataFromServer(result.body);
    } else {
        return undefined;
    }
};