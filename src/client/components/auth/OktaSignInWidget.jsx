import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '@okta/okta-signin-widget/dist/css/okta-theme.css';
import loginImage from '../../assets/img/books_icon.png';


export default class OktaSignInWidget extends Component {

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    // NOTE: most of the widget config is taken care of by the `Security` react component

    const signInConfig = {
      baseUrl: this.props.baseUrl,
      logo: loginImage,
      // authParams: {
      //   issuer: 'https://textmethod.okta.com/oauth2/ausaroy8pupHxvIkE356',
      //   redirectUri: 'http://localhost:3000/implicit/callback',
      //   // display: 'popup',
      //   responseType: ['id_token', 'token'],
      //   scopes: ['openid', 'email', 'profile'],
      // },
    };

    // const signInConfig = {
    //   baseUrl: 'https://textmethod.okta.com',
    //   clientId: '0oaarkncuf66O1gKd356',
    //   redirectUri: 'http://localhost:3000/implicit/callback',
    //   authParams: {
    //     issuer: 'https://textmethod.okta.com/oauth2/ausaroy8pupHxvIkE356',
    //     // display: 'popup',
    //     responseType: ['id_token', 'token'],
    //     scopes: ['openid', 'email', 'profile'],
    //   },
    // };
    //   idps: [
    //     { type: 'GOOGLE', id: '0oa5wn3l7TFQMBEEQ356' },
    //     { type: 'FACEBOOK', id: '0oa2bnhvvbUAWa36K356' },
    //     { type: 'LINKEDIN', id: 'example0' },
    //     { type: 'MICROSOFT', id: '0oa5wo438UbM8Y1vG356' },
    //     { id: '0oa66b17m0XBRYUyp356', text: 'Login with External SAML IdP' }
    //   ],
    // };


    if (this.props.idpRequestContext) {
      Object.assign(signInConfig, {
        features: {
          idpDiscovery: true,
        },
        idpDiscovery: {
          requestContext: this.props.idpRequestContext,
        },
      });
    }

    // if (this.props.signInMode === 'idps') {
    //   Object.assign(signInConfig, {
    //     idps: [
    //       { type: 'GOOGLE', id: '0oa5wn3l7TFQMBEEQ356' },
    //       { type: 'FACEBOOK', id: '0oa5hbzrdUkQOCO5y356' },
    //       { type: 'LINKEDIN', id: 'example0' },
    //       { type: 'MICROSOFT', id: '0oa5wo438UbM8Y1vG356' },
    //       { id: '0oa66b17m0XBRYUyp356', text: 'Login with External SAML IdP' }
    //     ],
    //   });
    // }
    // console.log(JSON.stringify(signInConfig));
    this.widget = new OktaSignIn(signInConfig);
    this.widget.renderEl({ el }, this.props.onSuccess, this.props.onError);
  }

  componentWillUnmount() {
    this.widget.remove();
  }

  render() {
    return <div />;
  }

  getSignInConfig(foo) {
    console.log('>>>>>>>>>', foo);
  }


};
