/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState, FC } from "react";
import { PrimaryButton } from './Styles';
import { DatasetList } from "./Datasets";
import { getDatasets, DatasetData } from "./DatasetData"
import { Page } from "./Page";
import { PageTitle } from "./PageTitle";
//import { RouteComponentProps } from "react-router-dom";
import { useAuth } from "./Auth";
import { useNavigate } from 'react-router';

export const HomePage = () => {
    const [dataSets, setDataSets] = useState<DatasetData[]>([]);
    const [dataSetsLoading, setDatasetsLoading] = useState(true);
    
    useEffect(() => {
     //   let cancelled = false;
        const doGetDatasets = async () => {
            const dataSets = await getDatasets(); 
      //      if (!cancelled) {
                setDataSets(dataSets);
                setDatasetsLoading(false);
      //      }
        };
        
        doGetDatasets();
    }, []);
    console.log('rendered');
    const navigate = useNavigate();
    const handleImportClick = () => {
        navigate('import');
    };
    const { isAuthenticated } = useAuth();
    console.log('The value of isAuthenticatd is ' + isAuthenticated);
    return (
    <Page>
        <div
            css={css`
            margin: 50px auto 20px auto;
            padding: 30px 20px;
            max-width: 600px;
        `}
        >
            <div
                css={css`
                display: flex;
                align-items: center;
                justify-content: space-between;
            `}
            >
                <h2
                    css={css`
                    font-size: 15px;
                    font-weight: bold;
                    margin: 10px 0px 5px;
                    text-align: center;
                    text-transform: uppercase;
                `}
                
                >Datasets</h2>
            <PrimaryButton onClick={handleImportClick}>Import All Into Power BI</PrimaryButton>
            </div>
            </div>
            { dataSetsLoading ? (
                <div
                    css={css`
                        font-size: 16px;
                        font-style: italic;
                    `}
                    >
                    Loading...
                </div>) : (
                <DatasetList data={dataSets || []} />
            )}
    </Page>
)};