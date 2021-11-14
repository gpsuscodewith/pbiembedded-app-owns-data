import { wait, waitFor } from "@testing-library/dom";
import { useAuth0 } from '@auth0/auth0-react';
import { http } from './http';

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


export const getUsers = async(accessToken: string): Promise<UserData[]> => {
    console.log('Inside getUsers with an accessToken of ' + accessToken);
    const result = await http<UserDataFromServer[]>({
        path: '/users',
        accessToken: accessToken
    });
    console.log('After call to /users');
    if (result.ok && result.body) {
        return result.body.map(mapUserDataFromServer);
    } else {
        return [];
    }
};

export const postUser = async(accessToken: string, user: UserData): Promise<UserData | undefined> => {
    console.log('Inside postUser with an accessToken of ' + accessToken);
    const result = await http<UserDataFromServer, UserData>({
        path: '/users',
        method: 'post',
        body: user,
        accessToken: accessToken
    });
    if (result.ok && result.body) {
        return mapUserDataFromServer(result.body);
    } else {
        return undefined;
    }
};


