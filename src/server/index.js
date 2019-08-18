import fs from 'fs';
import assert from 'assert';
import request from 'request-promise';

import express from 'express';
import cors from 'cors';
import Loki from 'lokijs';
import passport from 'passport';
import JwtBearer from 'passport-oauth2-jwt-bearer';
import uuidv4 from 'uuid/v4';

require('dotenv').config();

/* LOAD SAMPLE DATA */
const db = new Loki('items', {
  autoload: true,
  autoloadCallback: () => {
    let items = db.getCollection('items');
    if (items === null) {
      items = db.addCollection('items', { unique: 'itemId' });
      db.addCollection('orders', { unique: 'orderId' });
      const data = JSON.parse(fs.readFileSync(`${__dirname}/data/books.json`, 'utf8'));
      data.forEach(item =>
        items.insert({
          itemId: item.itemId,
          title: item.title,
          description: item.description,
          count: item.count,
          price: item.price,
          image: item.image,
          target: item.target,
        }));
    }
  },
  // autosave: true,
  // autosaveInterval: 4000,
});
/* END LOAD SAMPLE DATA */

/* CONFIGURE OAUTH2/JWT PASSPORT STRATEGY */
const AUD = process.env.APP_URL;
const ISSUER = `${process.env.OKTA_URL}/oauth2/${process.env.AUTH_SERVER_ID}`;
const METADATA_URL = `${ISSUER}/.well-known/oauth-authorization-server`;
const strategy = new JwtBearer.Strategy(
  {
    audience: AUD,
    issuer: ISSUER,
    metadataUrl: METADATA_URL,
    // loggingLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  },
  (token, done) => done(null, token)
);
/* END CONFIGURE OAUTH2/JWT PASSPORT STRATEGY */

const app = express();
// TODO: use Winston logger?
app.use(express.json());
app.use(passport.initialize());
passport.use(strategy);
const corsOptions = {
  origin: process.env.APP_URL, // NOTE: this may be unnecessary if proxying the API
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.static('dist'));

app.get(
  '/api/items',
  passport.authenticate('oauth2-jwt-bearer', { session: false, scopes: ['items:read'] }),
  (req, res) => {
    const items = db.getCollection('items');
    const results = items.find({ target: 'PUBLIC' });
    res.json(results);
  }
);

app.post(
  '/api/orders',
  passport.authenticate('oauth2-jwt-bearer', { session: false, scopes: ['orders:create'] }),
  (req, res) => {
    const orders = db.getCollection('orders');
    const orderId = uuidv4();
    const order = Object.assign({ orderId, state: 'pending' }, req.body);
    orders.insert(order);
    res.json({ status: 'OK' });
  }
);

app.get(
  '/api/orders/user/:userId',
  passport.authenticate('oauth2-jwt-bearer', { session: false, scopes: ['orders:create'] }),
  (req, res) => {
    // TODO: handle assertion error
    assert.equal(req.params.userId, req.user.uid);
    const orders = db.getCollection('orders');
    const results = orders.find({ userId: req.user.uid, state: 'pending' });
    res.json(results);
  }
);

app.get(
  '/api/orders',
  passport.authenticate('oauth2-jwt-bearer', { session: false, scopes: ['orders:read'] }),
  (req, res) => {
    const orders = db.getCollection('orders');
    const results = orders.find({ state: 'pending' });
    res.json(results);
  }
);

app.patch(
  '/api/orders/:orderId/complete',
  passport.authenticate('oauth2-jwt-bearer', { session: false, scopes: ['orders:update'] }),
  (req, res) => {
    const orders = db.getCollection('orders');
    const items = db.getCollection('items');
    const order = orders.findOne({ orderId: req.params.orderId });
    if (order) {
      const item = items.findOne({ itemId: order.itemId });
      order.state = 'complete';
      orders.update(order);
      item.count -= 1;
      items.update(item);
    }
    res.json([]);
  }
);

app.get(
  '/api/users',
  // TODO: restrict by scope
  async (req, res) => {
    const apiUrl = `${process.env.OKTA_URL}/api/v1/users`;
    const headers = {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: `SSWS ${process.env.API_ACCESS_TOKEN}`,
    };
    const results = await request({
      uri: apiUrl,
      json: true,
      method: 'GET',
      headers,
    });
    res.json(results);
  }
);

const apiUrl = new URL(process.env.API_URL);
app.listen(apiUrl.port || '8080', () => console.log(`Listening on port ${apiUrl.port}!`));
