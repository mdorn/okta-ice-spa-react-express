import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';

import Home from './Home';
import Nav from './Nav';
import Social from './layout/Social';
import Footer from './layout/Footer';
import Login from './auth/Login';
import LoginNoPrompt from './auth/LoginNoPrompt';
import LoginRedirect from './auth/LoginRedirect';
import Dashboard from './Dashboard';
import Promos from './Promos';
import Products from './Products';
import Admin from './Admin';

const onAuthRequired = process.env.SIGNIN_MODE === 'hosted' ?
  null
  : ({ history }) => {
    history.push('/login');
  };

const Main = () => (
  <Router>
    <div>
      <Security
        issuer={`${process.env.OKTA_URL}/oauth2/${process.env.AUTH_SERVER_ID}`}
        client_id={process.env.OIDC_CLIENT_ID}
        redirect_uri={`${window.location.origin}/implicit/callback`}
        onAuthRequired={onAuthRequired}
        scope={process.env.SCOPES.split(' ')}
      >
        <Nav />
        <header className="masthead">
          <div className="container h-100">
            <Route path="/" exact component={Home} />
            <Route path="/promos" component={Promos} />
            <Route path="/products" component={Products} />
            <SecureRoute path="/dashboard" component={Dashboard} />
            <SecureRoute path="/admin" component={Admin} />
            <Route
              path="/login"
              render={
                () => (<Login
                  baseUrl={process.env.OKTA_URL}
                  signInMode={process.env.SIGNIN_MODE}
                />)
              }
              />
            <Route
              path="/login-idp"
              render={
                () => (<Login
                  baseUrl={process.env.OKTA_URL}
                  idpRequestContext={process.env.IDP_REQUEST_CONTEXT}
                  signInMode={process.env.SIGNIN_MODE}
                />)
              }
              />
            <Route path="/implicit/callback" component={ImplicitCallback} />
            <Route path="/login-noprompt" component={LoginNoPrompt} />
            <Route path="/login-hosted" component={LoginRedirect} />
          </div>
        </header>
      </Security>
      <Social />
      <Footer />
    </div>
  </Router>
);
export default Main;
