import { wait, waitFor } from "@testing-library/dom";
import { getAccessToken } from "./Auth";
import { http } from './http';

export interface DatasetData {
    id: number;
    tenantId: number;
    pbiWorkspace: string;
    datasetName: string;
 //   tags: string[];
 //   createDate: Date;
    createdBy: string;
}

export interface DatasetDataFromServer {
    id: number;
    tenantId: number;
    pbiWorkspace: string;
    datasetName: string;
 //   tags: string[];
 //   createDate: Date;
    createdBy: string;
}

export const mapDatasetDataFromServer = (
    dataSet: DatasetDataFromServer,
): DatasetData => ({
    ...dataSet
});

export const getDatasets = async (): Promise<DatasetData[]> => {
    console.log('Inside getDatasets');
    const accessToken = await getAccessToken();
    console.log('After getAccessToken.  The returned value is ' + accessToken);
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

/*
const datasets: DatasetData[] = [
    {
        datasetId: 1,
        tenantId: 1,
        datasetName: "Ratings and Summary Scores",
        tags: [
            "KeyIssueQuartiles",
            "GovernancePillarScore",
            "ESGRatingChange",
            "ESGRating",
            "SocialPillarScore"
        ],
        createDate: new Date()
    },
    {
        datasetId: 2,
        tenantId: 1,
        datasetName: "Drill Down Scores",
        tags: [
            "ESGRatingChange",
            "ESGRating",
            "KeyIssueQuartiles",
            "GovernancePillarScore",
            "KeyIssueScore"
        ],
        createDate: new Date()
    },
    {
        datasetId: 3,
        tenantId: 1,
        datasetName: "Analyst Insights",
        tags: [
            "Analyst Insight head",
            "Rating Analysis",
            "Analyst Insight narr",
            "GovernancePillarScore",
            "KeyIssueScore"
        ],
        createDate: new Date()
    }
];

const waitFn = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const getDatasets = async (): Promise<DatasetData[]> => {
    await waitFn(500);
    return datasets;
}*/