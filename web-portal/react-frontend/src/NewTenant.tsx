import { FC } from "react";
import * as React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { TenantData, postTenant } from './Data/Tenant';
import { Button } from "@material-ui/core";
import { http } from './Data/http';

interface Props {
    tenantCreated: (tenant: TenantData) => void;
}

export const NewTenantForm = ({tenantCreated}: Props) => {
    const [message, setMessage] = React.useState("");
    const [tenantName, setTenantName] = React.useState("");
    const { getAccessTokenSilently } = useAuth0();

    const createTenant = async() => {
        try {
            let tenantData: TenantData = {
                id: 0,
                tenantName: tenantName
            };
            const token = await getAccessTokenSilently();
            const result = await postTenant(token, tenantData);
            if (result !== undefined) {
                tenantCreated(result);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
          <TextField id="tenantName" onChange={(event) => setTenantName(event.target.value)} label="Tenant Name" variant="outlined" />
          <Button variant="contained" onClick={ () => { createTenant(); } }>Submit</Button>
        </Box>
    );
};