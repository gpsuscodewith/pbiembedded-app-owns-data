import { wait, waitFor } from "@testing-library/dom";
import { useAuth0 } from '@auth0/auth0-react';

export interface UserData {
    id: number;
    userId: string;
    email: string;
    lastName: string;
    firstName: string;
}

export interface UserDataFromServer {
    id: number;
    userId: string;
    email: string;
    lastName: string;
    firstName: string;
}

const mapUserDataFromServer = (
    user: UserDataFromServer,
) : UserData => ({
    ...user
});

export const getUsers = async(): Promise<UserData[]> => {
    console.log('Inside getUsers');
  //  const accessToken = await getAccessToke();
} ;