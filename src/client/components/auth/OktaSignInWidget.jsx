import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import '@okta/okta-signin-widget/dist/css/okta-theme.css';
import cowImage from '../../assets/img/cow_icon.png';


export default class OktaSignInWidget extends Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    const signInConfig = {
      baseUrl: this.props.baseUrl,
      logo: cowImage,
    };
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
    this.widget = new OktaSignIn(signInConfig);
    this.widget.renderEl({el}, this.props.onSuccess, this.props.onError);
  }

  componentWillUnmount() {
    this.widget.remove();
  }

  render() {
    return <div />;
  }
};
