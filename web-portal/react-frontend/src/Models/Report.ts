import { wait, waitFor } from "@testing-library/dom";

export interface ReportData {
    id: number;
    dataSetId: number;
    reportName: string;
    workspaceId: number;
    pbiIdentifier: string;
    embedUrl: string;
    accessToken: string;
}