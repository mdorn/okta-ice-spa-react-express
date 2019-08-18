import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

import Wrapper from './layout/Wrapper';

export default withAuth(class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: {},
      idToken: {},
    };
  }

  async componentDidMount() {
    const tokens = await this.getDecodedTokens();
    this.setState({
      accessToken: tokens.accessToken.payload,
      idToken: tokens.idToken.payload,
    });
  }

  async getDecodedTokens() {
    const accessToken = await this.props.auth.getAccessToken();
    const idToken = await this.props.auth.getIdToken();
    const accessTokenDecoded = await this.props.auth._oktaAuth.token.decode(accessToken);
    const idTokenDecoded = await this.props.auth._oktaAuth.token.decode(idToken);
    return {
      accessToken: accessTokenDecoded,
      idToken: idTokenDecoded,
    };
  }

  render() {
    let isAdmin;
    if (this.state.idToken.groups && this.state.idToken.groups.includes('Admin')) {
      isAdmin = true;
    }
    return (
      <Wrapper>
        <div id="left">
          <h1 className="mb-5">Dashboard</h1>
          <Link to="/promos" className="btn btn-outline btn-xl js-scroll-trigger">Get Promos!</Link>
        </div>
        <div id="right">
          <div className="alert alert-info" role="alert">
            <p><i className="fa fa-info-circle"></i> All of these values are retrieved from the OIDC <code>id_token</code>. If you click on <code>ID_TOKEN</code> you can see any custom claims in the token provided by Okta in addition to the standard OIDC claims.</p>
          </div>
          <p>Welcome to the dashboard, <strong>{this.state.idToken.name}</strong>!</p>
          <p>Your email address and username is <code>{this.state.idToken.preferred_username}</code>.</p>
          <p>Your user id is <code>{this.state.idToken.sub}</code>.</p>
          { isAdmin ? <p><Link to="/admin" className="btn btn-primary" style={{ color: 'white' }}>Admin</Link></p> : null }
          <p>
            <button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
              id_token
            </button>
            &nbsp;
            <button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample2" aria-expanded="false" aria-controls="collapseExample">
              access_token
            </button>
          </p>
          <div className="collapse" id="collapseExample">
            <code><pre style={{color: 'white'}}>{JSON.stringify(this.state.idToken, null, 4)}</pre></code>
          </div>
          <div className="collapse" id="collapseExample2">
            <code><pre style={{color: 'white'}}>{JSON.stringify(this.state.accessToken, null, 4)}</pre></code>
          </div>
        </div>
      </Wrapper>
    );
  }
});

