import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import { UsersPage } from './UsersPage';
import { TenantsPage } from './TenantsPage';
import { WorkspacePage } from './WorkspacePage';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

export const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
        >
          {value === index && (
            <Box sx={{ p: 3 }}>
              <Typography>{children}</Typography>
            </Box>
          )}
        </div>
      );
};

export const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
};

export const NavTabs = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // Review tab types at 
    // https://mui.com/components/tabs/
    return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Tenants" {...a11yProps(0)} />
          <Tab label="Workspaces" {...a11yProps(1)} />
          <Tab label="Users" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TenantsPage />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <WorkspacePage />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UsersPage />
      </TabPanel>
    </Box>
    );
};