import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import logo from './logo.svg';
import { Header } from './Header';
import { HomePage } from './HomePage';
import { SignInPage } from "./SignInPage";
import { SignOutPage } from "./SignOutPage";
import { NotFoundPage } from "./NotFoundPage";
import { Dataset } from './Dataset';
import { fontFamily, fontSize, gray2 } from './Styles';
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { AuthProvider } from './Auth';

const App: React.FC = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
      <div 
        css={css`
        font-family: ${fontFamily};
        font-size: ${fontSize};
        color: ${gray2};
      `}
      >
        <Header />
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="signin" element={<SignInPage action="signin" />} />
          <Route
            path="/signin-callback"
            element={<SignInPage action="signin-callback" />}
          />
          <Route path="signout" element={<SignOutPage action="signout" />} />
          <Route
            path="/signout-callback"
            element={<SignOutPage action="signout-callback" />}
          />
           <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>    
  </BrowserRouter>
  </AuthProvider>
  );
};

export default App;
