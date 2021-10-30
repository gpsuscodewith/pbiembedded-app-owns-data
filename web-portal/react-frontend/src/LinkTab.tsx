import * as React from 'react';
import Tab from '@mui/material/Tab';
import { FC } from 'react';

export interface LinkTabProperties {
    label: string;
    href: string;
};

export const LinkTab : FC<LinkTabProperties> = ({label, href}) => {
    return (
        <Tab
          component="a"
          onClick={(event: { preventDefault: () => void; }) => {
            event.preventDefault();
          }}
          label={label}
          href={href}
        />
      );
};