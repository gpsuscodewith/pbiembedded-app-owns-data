import { FC, useEffect } from "react";
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
    const [initialLoad, setInitialLoad] = React.useState<boolean>(true);

    useEffect(() => {
      console.log('useEffect() fired in UserGroups.tsx');
      loadChecked();
    }, [userWorkspaces]);

    const loadChecked = () => {
      console.log('Inside loadChecked');
   //   if (initialLoad) {
        console.log('initialLoad is true');
        let newChecked = [...checked];
        userWorkspaces.map(x => {
          console.log(`Inside userWorkspaces.map with a value of x being ${x}`);
          newChecked.push(x.workspaceId)
        });
        setChecked(newChecked);
        setInitialLoad(false);
 //     }
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

      return (
          <div>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {workspaces.map((value) => {
            console.log(`Inside workspaces.map with a value of ${value.id}`);
            let setChecked: boolean = false;
            console.log(`Prior to the call of checked.indexOf and it has a length of ${checked.length}`);
            const checkedIndex = checked.indexOf(value.id);
            console.log(`The value of checkedIndex is ${checkedIndex}`);
            checked.map(i => console.log(`Inside checked.map with a value of ${i}`));
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