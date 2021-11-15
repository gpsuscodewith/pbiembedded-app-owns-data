import { FC } from "react";
import * as React from 'react';
import { DataGrid, GridColDef, GridSelectionModel, GridRenderCellParams, GridApi, GridCellValue } from '@mui/x-data-grid';
import { UserData } from './Data/User';
import Button from "@mui/material/Button";
import { BootstrapButton } from "./BootstrapButton";
import { Link } from "@material-ui/core";



interface Props {
    data: UserData[];
    onManageUser?: (id: string) => void;
}

export const UserGrid: FC<Props> = ({data, onManageUser}) => {
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
    
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
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
                        console.log(`The value of the id for the user is ${id}`);
                    }
                   // return alert(JSON.stringify(thisRow, null, 4));
    
                   if (onManageUser !== undefined) {
                       onManageUser(id);
                   }
                };
    
                return <Link onClick={onClick} underline="always">Manage</Link>;
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
)};
