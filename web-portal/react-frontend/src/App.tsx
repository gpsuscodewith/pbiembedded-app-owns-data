import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import logo from './logo.svg';
import './App.css';
import { NavTabs } from './NavTabs';
import { Header } from './Header';

function App() {

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="" element={ <NavTabs />} />
        <Route path="/" element={ <NavTabs />} />
      </Routes>
      
    </BrowserRouter>
    
  );

}

export default App;


/*
/*
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
          Hello {user && user.name}{' '}
          <button onClick={() => logout({ returnTo: window.location.origin + '/signout-callback'})}>
            Log out
          </button>
        </div>
        <div>
          <NavTabs></NavTabs>
        </div>
      </div>
    );
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>;
  }
*/
