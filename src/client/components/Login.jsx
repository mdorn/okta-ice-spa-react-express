import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

import Wrapper from './layout/Wrapper';
import OktaSignInWidget from './OktaSignInWidget';


export default withAuth(class Login extends Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {
      authenticated: null
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
      return this.props.auth.redirect({
        sessionToken: res.session.token
      });
   } else {
    // The user can be in another authentication state that requires further action.
    // For more information about these states, see:
    //   https://github.com/okta/okta-signin-widget#rendereloptions-success-error
    }
  }

  onError(err) {
    console.log('error logging in', err);
  }

  render() {
    if (this.state.authenticated === null) return null;
    return this.state.authenticated ?
      <Redirect to={{ pathname: '/' }}/> :
      <Wrapper>
        <div id="left">
          <OktaSignInWidget
            baseUrl={this.props.baseUrl}
            onSuccess={this.onSuccess}
            onError={this.onError}
          />
        </div>
        <div id="right">
          <div className="alert alert-info" role="alert">
            <p><i className="fa fa-info-circle"></i>&nbsp;
              This is an example of the <a href="https://developer.okta.com/code/javascript/okta_sign-in_widget">Okta Sign-In Widget</a>.
              You may have arrived here after trying to access a link in the application that requires authenticaiton, and is therefore
              protected by the <code>SecureRoute</code> Okta React component.
            </p>
          </div>
        </div>
      </Wrapper>;
  }
});
