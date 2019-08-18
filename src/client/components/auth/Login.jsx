import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

import { handleIdpDiscovery } from '../../util';
import Wrapper from '../layout/Wrapper';
import OktaSignInWidget from './OktaSignInWidget';

class Login extends Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {
      authenticated: null,
    };
    this.checkAuthentication();
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  onSuccess(res) {
    if (res.status === 'SUCCESS') {
      console.log(JSON.stringify(res.session));
      return this.props.auth.redirect({ sessionToken: res.session.token });
    } else if (res.status === 'IDP_DISCOVERY') {
      const idpInfo = handleIdpDiscovery(this.props.auth._config); // eslint-disable-line
      document.cookie = idpInfo.cookie;
      res.idpDiscovery.redirectToIdp();
    }
    return null;
  }

  onError(err) {  // eslint-disable-line
    console.log('error logging in', err);
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  render() {
    if (this.state.authenticated === null) return null;
    return this.state.authenticated ?
      <Redirect to={{ pathname: '/' }} /> :
      <Wrapper>
        <div id="left">
          <OktaSignInWidget
            baseUrl={this.props.baseUrl}
            onSuccess={this.onSuccess}
            onError={this.onError}
            idpRequestContext={this.props.idpRequestContext}
            signInMode={this.props.signInMode}
          />
        </div>
        <div id="right">
          <div className="alert alert-info" role="alert">
            <p><i className="fa fa-info-circle" />&nbsp;
              This is an example of the&nbsp;
              <a href="https://developer.okta.com/code/javascript/okta_sign-in_widget">Okta Sign-In Widget</a>.
              You may have arrived here after trying to access a link in the application that
              requires authentication, and is therefore
              protected by the <code>SecureRoute</code> component provided by the&nbsp;
              <a href="https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react">Okta React SDK</a>.
            </p>
          </div>
        </div>
      </Wrapper>;
  }
}

Login.defaultProps = {
  idpRequestContext: null,
  signInMode: null,
};

Login.propTypes = {
  // auth: PropTypes.shape.isRequired,  // FIXME: sometimes this is undefined, console gets noisy
  baseUrl: PropTypes.string.isRequired,
  idpRequestContext: PropTypes.string,
  signInMode: PropTypes.string,
};

export default withAuth(Login);
