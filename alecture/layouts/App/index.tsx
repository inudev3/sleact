import React, { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import loadable from '@loadable/component';



const Login = loadable(() => import('@pages/login'));
const SingUp = loadable(() => import('@pages/signup'));
const Workspace = loadable(()=> import("@layouts/Workspace"));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SingUp} />
      <Route path="/workspace/:workspace" component={Workspace}/>
    </Switch>
  );
};

export default App;
