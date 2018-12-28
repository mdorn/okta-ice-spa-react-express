import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

import Wrapper from './layout/Wrapper';

export default withAuth(class Promos extends Component {
  constructor(props) {
    super(props);
    this.apiUrl = process.env.API_URL;
    this.state = {
      error: null,
      promos: [],
    };
  }

  async getPromos() {
    const accessToken = await this.props.auth.getAccessToken();
    const response = await fetch(
      `${this.apiUrl}/api/promos`,
      { headers: {
        Authorization: `Bearer ${accessToken}`,
      } }
    );
    return response;
  }

  async componentDidMount() {
    const response = await this.getPromos();
    let state;
    if (response.status !== 200) {
      state = { error: `Couldn't get promos! The error was: ${response.statusText}` };
    } else {
      const json = await response.json();
      state = { promos: json };
    }
    this.setState(state);
  }

  renderPromos(promos) {
    const elems = promos.map(promo => {
      return(
        <li key={promo.code}>
          {promo.description} - Use promo code <span className={promo.target === 'PUBLIC' ? 'badge badge-primary' : 'badge badge-danger'}>{promo.code}</span>
        </li>
      );
    });
    return elems;
  }

  renderPremium() {
    console.log('TODO');
  }


  render() {
    return (
      <Wrapper>
        <div id="left">
          <div id="left">
            <h1 className="mb-5">Dashboard</h1>
            <a className="btn btn-outline btn-xl js-scroll-trigger" onClick={this.renderPremium}>Get PREMIUM Promos!</a>
          </div>
        </div>
        <div id="right">
          {
            this.state.error ?
              <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading"><i className="fa fa-exclamation-circle"></i> Access denied</h4>
                <p>{this.state.error}</p>
              </div>
            :
          <ul>
            {this.renderPromos(this.state.promos)}
          </ul>
          }
        </div>
      </Wrapper>
    );
  }
});

