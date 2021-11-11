import React, { useState, useEffect, useContext, createContext, FC } from 'react';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import { authSettings } from './AppSettings';
//import { useAuth0 } from "@auth0/auth0-react";

interface Auth0User {
  name?: string;
  email?: string;
}
interface IAuth0Context {
  isAuthenticated: boolean;
  user?: Auth0User;
  signIn: () => void;
  signOut: () => void;
  loading: boolean;
}
export const Auth0Context = createContext<IAuth0Context>({
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
  loading: true,
});

export const useAuth = () => useContext(Auth0Context);

export const AuthProvider: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<Auth0User | undefined>(undefined);
  const [auth0Client, setAuth0Client] = useState<Auth0Client>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth0 = async () => {
      setLoading(true);
      console.log('Inside AuthProvider useEffect() function');
      const auth0FromHook = await createAuth0Client(authSettings);
      console.log('The value returned from createAuth0Client is' + auth0FromHook);
      setAuth0Client(auth0FromHook);
      console.log('After setAuth0Client');

      if (
        window.location.pathname === '/signin-callback' &&
        window.location.search.indexOf('code=') > -1
      ) {
        console.log('received code back from auth0');
        await auth0FromHook.handleRedirectCallback();
        window.location.replace(window.location.origin);
      }

      const isAuthenticatedFromHook = await auth0FromHook.isAuthenticated();
      console.log("The value of isAuthenticatedFromHook on line 47 is " + isAuthenticatedFromHook);
      if (isAuthenticatedFromHook) {
        const user = await auth0FromHook.getUser();
        console.log('auth0FromHook.getUser() was successful');
        setUser(user);
      }
      setIsAuthenticated(isAuthenticatedFromHook);
      setLoading(false);
    };
    initAuth0();
  }, []);

  const getAuth0ClientFromState = () => {
    console.log('Inside getAuth0ClientFromState')
    if (auth0Client === undefined) {
      throw new Error('Auth0 client not set');
    }
    return auth0Client;
  };

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        signIn: () => getAuth0ClientFromState().loginWithRedirect(),
        signOut: () =>
          getAuth0ClientFromState().logout({
            client_id: authSettings.client_id,
            returnTo: window.location.origin + '/signout-callback',
          }),
        loading,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

export const getAccessToken = async () => {
  console.log('Inside getAccessToken');
  const auth0FromHook = await createAuth0Client(authSettings);
  console.log('After call to auth0FromHook');
  let accessToken = '';
  try {
    accessToken = await auth0FromHook.getTokenSilently();
  } catch (e) { 
    if (e.error === 'login_required') {
        auth0FromHook.loginWithRedirect();
    }
    if (e.error === 'consent_required') {
        auth0FromHook.loginWithRedirect();
    }
          throw e;
  }
  return accessToken;
};

/*
export const getAccessToken = async () => {
  console.log('Inside getAccessToken');
  const auth0FromHook = await createAuth0Client(authSettings);
  
  console.log('After call to auth0FromHook');
  const isAuthenticated = await auth0FromHook.isAuthenticated();
  console.log('After call from auth0Client.isAuthenticated with a value of ' + isAuthenticated);
  let accessToken = '';
  //try {
    accessToken = await auth0FromHook.getTokenSilently({
        audience: "https://appownsdataapi",
        claim: "read:datasets"
    });
//  } catch (e) {
 //   if (e.error === 'login_required') {
//        auth0FromHook.loginWithRedirect();
//    }
//    if (e.error === 'consent_required') {
//        auth0FromHook.loginWithRedirect();
//    }
//    throw e;
//  }
  
  return accessToken;
};
*/

