import { FC } from "react";
import * as React from 'react';
import { DataGrid, GridColDef, GridSelectionModel, GridRenderCellParams, GridApi, GridCellValue } from '@mui/x-data-grid';
import { DatasetData } from './Data/Dataset';
import Button from "@mui/material/Button";
import { BootstrapButton } from "./BootstrapButton";
import { Link } from "@material-ui/core";

interface Props {
    data: DatasetData[];
    onDeleteDataset?: (id: number) => void;
}

export const DatasetGrid: FC<Props> = ({data, onDeleteDataset}) => {
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
    
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'tenantId', 
            headerName: 'Tenant ID', 
            width: 150, 
            editable: false
        },
        {
            field: 'workspaceId', 
            headerName: 'Workspace ID', 
            width: 150, 
            editable: false
        },
        {
            field: 'pbiWorkspace', 
            headerName: 'Power BI Workspace', 
            width: 150, 
            editable: false
        },
        {
            field: 'pbiWorkspaceId', 
            headerName: 'Power BI Workspace ID', 
            width: 150, 
            editable: false
        },
        {
            field: 'pbiId', 
            headerName: 'Power BI ID', 
            width: 150, 
            editable: false
        },
        {
            field: 'dataSetName', 
            headerName: 'Dataset Name', 
            width: 150, 
            editable: false
        },
        {
            field: 'createdBy', 
            headerName: 'Created By', 
            width: 150, 
            editable: false
        },
        {
            field: 'webUrl', 
            headerName: 'Web Url', 
            width: 150, 
            editable: false
        },
        {
            field: ' ',
            headerName: '',
            sortable: false,
            renderCell: (params) => {
                const onClick = (e: { stopPropagation: () => void; }) => {
                    e.stopPropagation();
    
                    const api: GridApi = params.api;
                    const thisRow: Record<string, GridCellValue> = {};
    
                    api
                        .getAllColumns()
                        .filter((c) => c.field !== "__check__" && !!c)
                        .forEach(
                            (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
                        );
    
                    const id: string = thisRow['id'] != null ? thisRow['id'].toString() : '';
                    if (id.length > 0) {
                        console.log(`The value of the id for the dataset is ${id}`);
                        if (onDeleteDataset !== undefined) {
                            onDeleteDataset(parseInt(id));
                        }
                    }
                };
    
                return <Link onClick={onClick} underline="always">Delete</Link>;
            }
        }
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
        selectionModel={selectionModel}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>    
    )
};
