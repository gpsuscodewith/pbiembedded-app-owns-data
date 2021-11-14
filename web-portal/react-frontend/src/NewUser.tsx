import { FC } from "react";
import * as React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { UserData, postUser } from './Data/User';
import { Button } from "@material-ui/core";
import { http } from './Data/http';

interface Props {
    userCreated: (user: UserData) => void;
}

export const NewUserForm = ({userCreated}: Props) => {
    const [message, setMessage] = React.useState("");

    const [userId, setUserId] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [email, setEmail] = React.useState("");

    const { getAccessTokenSilently } = useAuth0();

    const createUser = async () => {
        try {
            let userData: UserData = {
                id: 0,
                userId: userId,
                lastName: lastName,
                firstName: firstName,
                email: email
            };
            
            const token = await getAccessTokenSilently();
            const result = await postUser(token, userData);
            if (result !== undefined) {
                userCreated(result);
            }
        } catch(error) {
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
      <TextField id="userId" onChange={(event) => setUserId(event.target.value)} label="User ID" variant="outlined" />
      <TextField id="lastName" onChange={(event) => setLastName(event.target.value)} label="Last Name" variant="outlined" />
      <TextField id="firstName" onChange={(event) => setFirstName(event.target.value)} label="First Name" variant="outlined" />
      <TextField id="email" onChange={(event) => setEmail(event.target.value)} label="Email" variant="outlined" />
      <Button variant="contained" onClick={ () => { createUser(); } }>Submit</Button>
    </Box>
    );
};