import { wait, waitFor } from "@testing-library/dom";
import { http } from './http';

export interface WorkspaceUserData {
    id: number;
    userId: number;
    workspaceId: number;
}

export interface WorkspaceUserDataFromServer {
    id: number;
    userId: number;
    workspaceId: number;
}

export interface WorkspaceUserDeleteResult {
    successful: boolean;
}

export interface WorkspaceUserDeleteResultFromServer {
    successful: boolean;
}

export interface WorkspaceUserPostResult {
    successful: boolean;
}

export interface WorkspaceUserPostResultFromServer {
    successful: boolean;
}

const mapWorkspaceUserDataFromServer = (
    workspaceUser: WorkspaceUserDataFromServer,
) : WorkspaceUserData => ({
    ...workspaceUser
});

const mapWorkspaceUserDeleteResultFromServer = (
    workspaceUserDeleteResult: WorkspaceUserDeleteResultFromServer
) : WorkspaceUserDeleteResult => ({
    ...workspaceUserDeleteResult
});

const mapWorkspaceUserPostResultFromServer = (
    workspaceUserPostResult: WorkspaceUserDeleteResultFromServer
): WorkspaceUserPostResult => ({
    ...workspaceUserPostResult
});

export const getWorkspacesForUser = async(accessToken: string, userId: number): Promise<WorkspaceUserData[]> => {
    const result = await http<WorkspaceUserDataFromServer[]>({
        path: `/users/${userId}/workspaces`,
        accessToken: accessToken,
    });
    if (result.ok && result.body) {
        return result.body.map(mapWorkspaceUserDataFromServer);
    } else {
        return [];
    }
};

export const postWorkspaceUser = async(
    accessToken: string, 
    workspaceUser: WorkspaceUserData): Promise<WorkspaceUserData | undefined> => {
    
    const result = await http<WorkspaceUserDataFromServer, WorkspaceUserData>({
        path: `/workspaceusers`,
        body: workspaceUser,
        method: 'post',
        accessToken: accessToken,
    });

    if (result.ok && result.body) {
        return mapWorkspaceUserDataFromServer(result.body);
    } else {
        return undefined;
    }
};

export const deleteWorkspaceUser = async(
    accessToken: string, 
    userId: number, 
    workspaceId: number): Promise<WorkspaceUserDeleteResult> => {
    
    const result = await http<WorkspaceUserDeleteResultFromServer>({
        path: `/users/${userId}/workspaces/${workspaceId}`,
        accessToken: accessToken,
        method: 'DELETE'
    });
    if (result.ok && result.body) {
        return mapWorkspaceUserDeleteResultFromServer(result.body);
    } else {
        return {
            successful: false
        };
    }
};