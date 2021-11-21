import { FC } from "react";
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import { UserData } from './Data/User';
import { WorkspaceUserData } from "./Data/WorkspaceUser";
import { WorkspaceData } from "./Data/Workspace";
import { Button } from "@mui/material";

interface Props {
    user: UserData;
    workspaces: WorkspaceData[];
    userWorkspaces: WorkspaceUserData[];
    addWorkspace: (id: number) => void;
    removeWorkspace: (id: number) => void;
}

export const UserGroups: FC<Props> = ({user, workspaces, userWorkspaces, addWorkspace, removeWorkspace}) => {
    const [checked, setChecked] = React.useState<number[]>([]);
    const [unChecked, setUnChecked] = React.useState<number[]>([]);

    const loadChecked = () => {
        userWorkspaces.map(x => checked.push(x.workspaceId));
    };

    const handleToggle = (value: number) => () => {
        console.log(`Inside handleToggle with a value of ${value}`);
        
        const checkedIndex = checked.indexOf(value);
        console.log(`checked index is ${checkedIndex}`);

        const newChecked = [...checked];

        if (checkedIndex === -1) {
          newChecked.push(value);
          addWorkspace(value);
        } else {
          newChecked.splice(checkedIndex, 1);
          removeWorkspace(value);
        }
    
        setChecked(newChecked);
      };

      const handleClick = (e: { stopPropagation: () => void; }) => {
        console.log(`Checked - ${checked}`);
        console.log(`Unchecked - ${unChecked}`);
      };

    loadChecked();

      return (
          <div>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {workspaces.map((value) => {
            let setChecked: boolean = false;
            const checkedIndex = checked.indexOf(value.id);
            if (checkedIndex !== -1) {
                setChecked = true;
            }
            const labelId = `checkbox-list-label-${value}`;
    
            return (
              <ListItem
                key={value.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments">
                    <CommentIcon />
                  </IconButton>
                } 
                disablePadding
              >
                <ListItemButton role={undefined} onClick={handleToggle(value.id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={setChecked}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value.workspaceName} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Button onClick={handleClick}>User Groups Button</Button>
        </div>
      );
};