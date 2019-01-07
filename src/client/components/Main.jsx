import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';

import Home from './Home';
import Nav from './Nav';
import Social from './layout/Social';
import Footer from './layout/Footer';
import Login from './auth/Login';
import Dashboard from './Dashboard';
import Promos from './Promos';

function onAuthRequired({history}) {
  history.push('/login');
}

const Main = () => (
  <Router>
    <div>
        <Security
          issuer={`${process.env.OKTA_URL}/oauth2/${process.env.AUTH_SERVER_ID}`}
          client_id={process.env.OIDC_CLIENT_ID}
          redirect_uri={window.location.origin + '/implicit/callback'}
          onAuthRequired={onAuthRequired}
          scope={['openid', 'email', 'profile', 'promos:read']}
        >
          <Nav />
          <header className="masthead">
            <div className="container h-100">
              <Route path="/" exact={true} component={Home} />
              <Route path="/promos" component={Promos} />
              <SecureRoute path="/dashboard" component={Dashboard} />
              <Route path="/login" render={() => <Login baseUrl={process.env.OKTA_URL} idpRequestContext={process.env.IDP_REQUEST_CONTEXT} />} />
              <Route path="/implicit/callback" component={ImplicitCallback} />
            </div>
          </header>
        </Security>
      <Social />
      <Footer />
    </div>
  </Router>
)
export default Main;
