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

export const postWorkspaceForUser = async(
    accessToken: string, 
    userId: number, 
    workspaceId: number): Promise<WorkspaceUserPostResult> => {
    
    const result = await http<WorkspaceUserPostResultFromServer>({
        path: `/users/${userId}/workspaces/${workspaceId}`,
        accessToken: accessToken,
        method: 'POST'
    });

    if (result.ok && result.body) {
        return mapWorkspaceUserPostResultFromServer(result.body);
    } else {
        return {
            successful: false
        };
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