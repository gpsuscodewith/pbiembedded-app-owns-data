import { wait, waitFor } from "@testing-library/dom";

export interface WorkspaceData {
    id: number;
    workspaceLocation: string;
    workspaceName: string;
    pbiIdentifier: string;
    tenantId: number;
}