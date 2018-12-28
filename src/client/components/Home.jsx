import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

import Wrapper from './layout/Wrapper';

const Home = () => (
  <Wrapper>
    <div id="left">
      <div className="header-content mx-auto">
        <h1 className="mb-5">Welcome!</h1>
        <Link to="/promos" className="btn btn-outline btn-xl js-scroll-trigger">Get Promos!</Link>
      </div>
    </div>
    <div id="right">
      <p>Welcome to the Okta Ice example app. It's a simple SPA app written in Node.js/React/Express showing you how to give your users access to restricted resources (in this case promo codes for a fictional Ice Cream store)
        using <a href="https://openid.net/connect/">OpenID Connect</a>, <a href="https://oauth.net/2/">OAuth 2.0</a>,
        and <a href="https://developer.okta.com">Okta</a>.</p>
    </div>
  </Wrapper>
);

export default Home;
