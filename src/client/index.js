import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import 'jquery';
import 'jquery.easing';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import './assets/js/new-age.js';
import Main from './components/Main';

import 'bootstrap/scss/bootstrap.scss';
import 'simple-line-icons/scss/simple-line-icons.scss';
import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/regular.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import '@fortawesome/fontawesome-free/scss/brands.scss';

import './assets/stylesheets/new-age.scss';

ReactDOM.render((
  <Router>
    <Main />
  </Router>
), document.getElementById('root'));
