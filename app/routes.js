/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import Login from './containers/Login';
import Dashboard from './containers/index';
import Customers from './containers/Customers';
import Hierarchy from './containers/Hierarchy';

import { userIsAuthenticatedRedir } from './auth';

export default () => (
  <App>
    <Switch>
      <Route exact path="/customers" component={userIsAuthenticatedRedir(Customers)} />
      <Route exact path="/corporation/hierarchy" component={userIsAuthenticatedRedir(Hierarchy)} />
      <Route exact path="/login" component={Login} />
      <Route path="/" component={userIsAuthenticatedRedir(Dashboard)} />
    </Switch>
  </App>
);
