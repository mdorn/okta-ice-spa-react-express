import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

// this component is to assist with external IdP discovery

export default withAuth(class LoginNoPrompt extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: false };
  }

  async componentDidMount() {
    const tokens = await this.props.auth._oktaAuth.token.getWithoutPrompt({
      responseType: ['id_token', 'token'],
      scopes: this.props.auth._config.scope,
    });
    const accessToken = tokens[1];
    const idToken = tokens[0];
    await this.props.auth._oktaAuth.tokenManager.add('accessToken', accessToken);
    await this.props.auth._oktaAuth.tokenManager.add('idToken', idToken);
    this.setState({ authenticated: true });
  }

  render() {
    // TODO: ideally we'd redirect to /dashboard, but router doesn't see user as authenticated
    return this.state.authenticated ? <Redirect to={{ pathname: '/' }} /> : null;
  }
});
