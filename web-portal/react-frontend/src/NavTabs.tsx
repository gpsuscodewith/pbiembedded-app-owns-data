import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import { LinkTab } from './LinkTab';

export const NavTabs = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
        setValue(newValue);

    };

    // Review tab types at 
    // https://mui.com/components/tabs/
    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
                <LinkTab label="Users" href="/users" />
                <LinkTab label="Tenants" href="/tenants" />
                <LinkTab label="Workspaces" href="/workspaces" />
            </Tabs>
        </Box>
    );
};