import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import { Table, Button } from 'reactstrap';

import Wrapper from './layout/Wrapper';
import Product from './Product';

export default withAuth(class Promos extends Component {
  constructor(props) {
    super(props);
    this.apiUrl = process.env.API_URL;
    this.state = {
      items: [],
    };
  }

  async componentDidMount() {
    const response = await this.getItems();
    let state = {};
    if (response.status !== 200) {
      state.error = `Couldn't get items! The error was: ${response.statusText}`;
    } else {
      const json = await response.json();
      state = { items: json };
    }
    this.setState(state);
  }

  async getItems() {
    const response = await fetch(`${this.apiUrl}/api/users`);
    return response;
  }

  renderItems(items) {
    let ct = 0;
    const elems = items.map(item =>
      (
        <tr key={item.id}>
          <th scope="row">{ct += 1}</th>
          <td>{item.profile.firstName}</td>
          <td>{item.profile.lastName}</td>
          <td>{item.profile.email}</td>
          <td><Button color="primary" size="sm"><i className="fa fa-user-edit"></i>&nbsp;Edit</Button></td>
          <td><Button color="danger" size="sm"><i className="fa fa-user-times"></i>&nbsp;Delete</Button></td>
        </tr>
      ));
    return elems;
  }

  render() {
    return (
      <div className="row h-100">
        <h1 className="mb-5">Admin</h1>
        <Table dark>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            { this.renderItems(this.state.items) }
          </tbody>
        </Table>
      </div>
    );
  }
});

