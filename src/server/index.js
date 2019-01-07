import fs from 'fs';
import os from 'os';
import path from 'path';

import express from 'express';
import cors from 'cors';
import loki from 'lokijs';
import passport from 'passport';

require('dotenv').config();

/* LOAD SAMPLE DATA */
const db = new loki('ice');
const promos = db.addCollection('promos', {unique: 'code'});
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/promos.json`, 'utf8'));
const validity = 30;
const endPromo = new Date();
endPromo.setDate(endPromo.getDate() + validity);
for (const key of Object.keys(data)) {
  data[key].forEach(item => {
    promos.insert({
      code: item.code,
      validFor: validity,
      target: item.target,
      endDate: endPromo.toDateString(),
      description: item.description,
    });
  })
}
/* END LOAD SAMPLE DATA */

/* CONFIGURE OAUTH2/JWT PASSPORT STRATEGY */
var Strategy = require('passport-oauth2-jwt-bearer').Strategy;
const AUD = process.env.API_URL;
const ISSUER = `${process.env.OKTA_URL}/oauth2/${process.env.AUTH_SERVER_ID}`;
const METADATA_URL = ISSUER + '/.well-known/oauth-authorization-server';
var strategy = new Strategy(
  {
    audience: AUD,
    issuer: ISSUER,
    metadataUrl: METADATA_URL,
    loggingLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  },
  function (token, done) {
    return done(null, token);
  }
);
/* END CONFIGURE OAUTH2/JWT PASSPORT STRATEGY */

const app = express();
app.use(passport.initialize());
passport.use(strategy);
app.use(cors());  //  WARNING: enables CORS for all domains; do not use in production
app.use(express.static('dist'));

// app.get('/api/promos',
//   function (req, res) {
//     const results = promos.chain().find({'target' : 'PUBLIC'}).data();
//     res.json(results);
//   }
// );

app.get('/api/promos',
  passport.authenticate('oauth2-jwt-bearer', { session: false, scopes: ['promos:read'] }),
  function (req, res) {
    const results = promos.chain().find({'target' : { '$in' : ['PUBLIC', 'PREMIUM'] } }).data();
    res.json(results);
  }
);

const apiUrl = new URL(process.env.API_URL);
app.listen(apiUrl.port || '8080', () => console.log(`Listening on port ${apiUrl.port}!`));
