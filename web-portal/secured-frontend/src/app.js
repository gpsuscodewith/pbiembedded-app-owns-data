import React from "react";
import { Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { NavBar, Footer, Loading } from "./components";
import Report from "./components/report";
import Admin from "./components/admin";
import Tenants from "./components/tenants";
import { Home, Profile, ExternalApi } from "./views";
import ProtectedRoute from "./auth/protected-route";


import "./app.css";
import CreateReport from "./components/create-report";
import Workspaces from "./components/workspaces";
import WorkspaceUsers from "./components/workspace-users";
import Users from "./components/users";

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div id="app" className="d-flex flex-column h-100">
      <NavBar />
      <div className="container flex-grow-1">
        <Switch>
          <Route path="/" exact component={Home} />
          <ProtectedRoute path="/admin" component={Admin} />
          <ProtectedRoute path="/tenants" component={Tenants} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/external-api" component={ExternalApi} />
          <ProtectedRoute path="/workspaces" component={Workspaces} />
          <ProtectedRoute path="/workspaceusers" component={WorkspaceUsers} />
          <ProtectedRoute path="/users" component={Users} />
          <ProtectedRoute path="/reports/:reportId" component={Report} />
          <ProtectedRoute path="/datasets/:datasetId/:workspaceId" component={CreateReport} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
};

export default App;
