/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';

export const Header = () => {
    const {
        isLoading,
        isAuthenticated,
        error,
        user,
        loginWithRedirect,
        logout,
      } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Oops... {error.message}</div>;
    }

    if (isAuthenticated) {
        return (
        <div>
            <div>
            Hello {user && user.name }{'| '}{user?.sub}{' '}
            <button onClick={() => logout({ returnTo: window.location.origin + '/signout-callback'})}>
                Log out
            </button>
            </div>
        </div>
        );
    } else {
        return <button onClick={loginWithRedirect}>Log in</button>;
    }
};


