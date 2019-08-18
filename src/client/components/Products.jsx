import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import { Card, Button, CardTitle, CardText, Row, Col, Badge } from 'reactstrap';

import Wrapper from './layout/Wrapper';
import Product from './Product';

export default withAuth(class Promos extends Component {
  constructor(props) {
    super(props);
    this.apiUrl = process.env.API_URL;
    this.state = {
      error: null,
      items: [],
      ordersCt: 0,
      accessToken: null,
      userId: null,
    };
  }

  async componentDidMount() {
    const accessToken = await this.props.auth.getAccessToken();
    const user = await this.props.auth.getUser();
    const response = await this.getItems(accessToken);
    let state = {};
    if (response.status !== 200) {
      state.error = `Couldn't get items! The error was: ${response.statusText}`;
    } else {
      const json = await response.json();
      state = {
        accessToken,
        userId: user.sub,
        items: json,
      };
    }
    this.setState(state);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('>>>>>', prevState);
  }

  async getItems(accessToken) {
    const response = await fetch(
      `${this.apiUrl}/api/items`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response;
  }

  async getUserOrders() {
    const response = await fetch(
      `${this.apiUrl}/api/orders/user/${this.state.userId}`,
      { headers: { Authorization: `Bearer ${this.state.accessToken}` } }
    );
    const result = await response.json();
    return result;
  }

  async placeOrder(itemId) {
    const response = await fetch(
      `${this.apiUrl}/api/orders`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.state.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          userId: this.state.userId,
        }),
      }
    );
    await response.json(); // TODO: error handling?
    const orders = await this.getUserOrders();
    this.setState({ ordersCt: orders.length });
  }

  renderItems(items) {
    const elems = items.map(item =>
      (
        <Col sm="3" key={item.itemId}>
          <Product item={item} onPlaceOrder={this.placeOrder.bind(this)} />
        </Col>
      ));
    return elems;
  }

  renderPremium() {
    console.log('TODO');
  }

  render() {
    return (
      <div className="row h-100">
        <div>
          {/* TODO: how to move this to the right? */}
          <Button>
            Orders Pending: <Badge color="primary">{this.state.ordersCt}</Badge>
          </Button>
        </div>
        <Row>
          {
            this.state.error ?
              <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading"><i className="fa fa-exclamation-circle" /> Access denied</h4>
                <p>{this.state.error}</p>
              </div>
            :
            this.renderItems(this.state.items)
          }
        </Row>
      </div>
    );
  }
});

