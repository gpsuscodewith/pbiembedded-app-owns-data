import { FC } from "react";
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { TenantData } from './Data/Tenant';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'tenantName', 
        headerName: 'Tenant Name', 
        width: 150, 
        editable: false
    },
];

interface Props {
    data: TenantData[];
}

export const TenantGrid: FC<Props> = ({data}) => ( 
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