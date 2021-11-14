import { FC } from "react";
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { WorkspaceData } from './Data/Workspace';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'workspaceLocation', 
        headerName: 'Workspace Location', 
        width: 150, 
        editable: false
    },
    {
        field: 'workspaceName', 
        headerName: 'Workspace Name', 
        width: 150, 
        editable: false
    },
    {
        field: 'pbiIdentifier', 
        headerName: 'Power Bi Identifier', 
        width: 150, 
        editable: false
    },
    {
        field: 'tenantId', 
        headerName: 'Tenant ID', 
        width: 150, 
        editable: false
    },
];

interface Props {
    data: WorkspaceData[];
}

export const WorkspaceGrid: FC<Props> = ({data}) => ( 
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
);