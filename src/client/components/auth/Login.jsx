import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import { handleIdpDiscovery } from '../../util';
import Wrapper from '../layout/Wrapper';
import OktaSignInWidget from './OktaSignInWidget';

export default withAuth(class Login extends Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      authenticated: null,
      activeTab: '1'
    };
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  onSuccess(res) {
    if (res.status === 'SUCCESS') {
      return this.props.auth.redirect({ sessionToken: res.session.token });
    } else if (res.status === 'IDP_DISCOVERY') {
      const idpInfo = handleIdpDiscovery(this.props.auth._config);
      document.cookie = idpInfo.cookie;
      res.idpDiscovery.redirectToIdp(idpInfo.authUrl);
      return;
    }
  }

  onError(err) {
    console.log('error logging in', err);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    if (this.state.authenticated === null) return null;
    return this.state.authenticated ?
      <Redirect to={{ pathname: '/' }}/> :
      <Wrapper>
        <div id="left">
          <OktaSignInWidget
            baseUrl={this.props.baseUrl}
            idpRequestContext={this.props.idpRequestContext}
            onSuccess={this.onSuccess}
            onError={this.onError}
          />
        </div>
        <div id="right">
          <div className="alert alert-info" role="alert">
            <p><i className="fa fa-info-circle"></i>&nbsp;
              This is an example of the <a href="https://developer.okta.com/code/javascript/okta_sign-in_widget">Okta Sign-In Widget</a>.
              You may have arrived here after trying to access a link in the application that requires authentication, and is therefore
              protected by the <code>SecureRoute</code> component provided by the <a href="https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react">Okta React SDK</a>.
            </p>
          </div>
        </div>
      </Wrapper>;
  }
});
