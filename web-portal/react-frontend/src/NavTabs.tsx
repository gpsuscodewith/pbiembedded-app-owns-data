import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import { LinkTab } from './LinkTab';

export const NavTabs = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
                <LinkTab label="Users" href="/users" />
                <LinkTab label="Page Two" href="/two" />
                <LinkTab label="Page Three" href="/three" />
            </Tabs>
        </Box>
    );
};