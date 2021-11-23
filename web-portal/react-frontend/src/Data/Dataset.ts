import { wait, waitFor } from "@testing-library/dom";
import { http } from "./http";

export interface DatasetData {
    id: number;
    tenantId: number;
    workspaceId: number;
    pbiWorkspace: string,
    pbiWorkspaceId?: string;
    pbiId?: string;
    dataSetName: string;
    createdBy?: string;
    webUrl?: string;
}

export interface DatasetDataFromServer {
    id: number;
    tenantId: number;
    workspaceId: number;
    pbiWorkspace: string;
    pbiWorkspaceId?: string;
    pbiId?: string;
    dataSetName: string;
    createdBy?: string;
    webUrl?: string;
}

const mapDatasetDataFromServer = (
    dataset: DatasetDataFromServer,
) : DatasetData => ({
    ...dataset
});

export const getDatasets = async(accessToken: string): Promise<DatasetData[]> => {
    console.log(`Inside getDatasets with an accessToken of ${accessToken}`);
    const result = await http<DatasetDataFromServer[]>({
        path: '/datasets',
        accessToken: accessToken
    }); 
    console.log('After call to /datasets');
    if (result.ok && result.body) {
        return result.body.map(mapDatasetDataFromServer);
    } else {
        return [];
    }
};

export const postDataset = async(accessToken: string, dataset: DatasetData): Promise<DatasetData | undefined> => {
    console.log('Inside postDataset with an accessToken of ' + accessToken);
    const result = await http<DatasetDataFromServer, DatasetData>({
        path: '/datasets',
        method: 'post',
        body: dataset,
        accessToken: accessToken
    });
    if (result.ok && result.body) {
        return mapDatasetDataFromServer(result.body);
    } else {
        return undefined;
    }
};