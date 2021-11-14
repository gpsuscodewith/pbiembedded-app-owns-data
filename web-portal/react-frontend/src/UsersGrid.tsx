import { FC } from "react";
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { UserData } from './Data/User';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'userId', 
        headerName: 'User ID', 
        width: 150, 
        editable: false
    },
    {
        field: 'email', 
        headerName: 'Email Address', 
        width: 150, 
        editable: true
    },
    {
        field: 'lastName', 
        headerName: 'Last Name', 
        width: 150, 
        editable: true
    },
    {
        field: 'firstName', 
        headerName: 'First Name', 
        width: 150, 
        editable: true
    }
];

interface Props {
    data: UserData[];
}

export const UserGrid: FC<Props> = ({data}) => ( 
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
