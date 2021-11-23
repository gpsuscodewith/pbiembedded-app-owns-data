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

export const getMe = async(accessToken: string): Promise<UserData | undefined> => {
    console.log(`Inside getMe with an accessToken of ${accessToken}`);
    const result = await http<UserDataFromServer>({
        path: `/me`,
        accessToken: accessToken
    });
    if (result.ok && result.body) {
        return mapUserDataFromServer(result.body);
    } else {
        return undefined;
    }
};

export const getUsers = async(accessToken: string): Promise<UserData[]> => {
    const result = await http<UserDataFromServer[]>({
        path: '/users',
        accessToken: accessToken
    });
    if (result.ok && result.body) {
        return result.body.map(mapUserDataFromServer);
    } else {
        return [];
    }
};

export const getUser = async(accessToken: string, id: number): Promise<UserData | undefined> => {
    console.log(`Inside getUser with an accessToken of ${accessToken} and an id of ${id}`);
    const result = await http<UserDataFromServer>({
        path: `/users/${id}`,
        accessToken: accessToken
    });
    if (result.ok && result.body) {
        return mapUserDataFromServer(result.body);
    } else {
        return undefined;
    }
};

export const postUser = async(accessToken: string, user: UserData): Promise<UserData | undefined> => {
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

export const putUser = async(accessToken: string, user: UserData): Promise<UserData | undefined> => {
    const result = await http<UserDataFromServer, UserData>({
        path: `/users/${user.id}`,
        method: 'put',
        body: user,
        accessToken: accessToken
    });
    if (result.ok && result.body) {
        return mapUserDataFromServer(result.body);
    } else {
        return undefined;
    }
};


