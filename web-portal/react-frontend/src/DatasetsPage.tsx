/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getUsers, UserData } from "./Data/User";
import { styled } from '@mui/material/styles';
import { UserList } from "./UsersList";
import { Button } from '@mui/material';
import { UserGrid } from './UsersGrid';
import { BootstrapButton } from './BootstrapButton';
import { DatasetData, getDatasets } from './Data/Dataset';
import { NewDataset } from './NewDataset';

export const DatasetsPage = () => {
    const [datasets, setDatasets] = useState<DatasetData[]>([]);
    const [datasetsLoading, setDatasetsLoading] = useState<boolean>(true);
    const [creatingNewDataset, setCreatingNewDataset] = useState<boolean>(true);

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const doGetDatasets = async() => {
            const accessToken = await getAccessTokenSilently();
            const datasets = await getDatasets(accessToken);
            setDatasets(datasets);
            setDatasetsLoading(false);
        };
        if (isAuthenticated) {
            doGetDatasets();
        } else {
            console.log('The value of isAuthenticated is ' + isAuthenticated);
        }
    }, [isAuthenticated, creatingNewDataset]);

    const addDataset = () => {
        setCreatingNewDataset(true);
    };

    const datasetAdded = (dataset: DatasetData) => {
        setCreatingNewDataset(false);
    };

    return (
        <div>
            {datasetsLoading ? (
                <div
                css={css`
                    font-size: 16px;
                    font-style: italic;
                `}
                >
                Loading...
              </div>
            ) : creatingNewDataset ? (
                <NewDataset />
            ) : (
                <div>
                    <div>
                        <BootstrapButton variant="contained" color="primary" onClick={ () => { addDataset(); } }>Add Dataset</BootstrapButton>
                    </div>
                </div>
            )}
        </div>
    );

};