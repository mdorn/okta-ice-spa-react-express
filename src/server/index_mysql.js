import fs from 'fs';
import os from 'os';
import path from 'path';

import express from 'express';
import cors from 'cors';
import Loki from 'lokijs';
import passport from 'passport';
import sqlite3 from 'sqlite3';

require('dotenv').config();

/* LOAD SAMPLE DATA */
// const db = new Loki('/tmp/items.json', {
//   autoload: true,
//   autoloadCallback: databaseInitialize,
//   autosave: true,
//   autosaveInterval: 4000,
// });
// // const promos = db.addCollection('promos', { unique: 'code' });
// // let data = JSON.parse(fs.readFileSync(`${__dirname}/data/promos.json`, 'utf8'));
// // const validity = 30;
// // const endPromo = new Date();
// // endPromo.setDate(endPromo.getDate() + validity);
// // for (const key of Object.keys(data)) {
// //   data[key].forEach(item => {
// //     promos.insert({
// //       code: item.code,
// //       validFor: validity,
// //       target: item.target,
// //       endDate: endPromo.toDateString(),
// //       description: item.description,
// //     });
// //   })
// // }

// // implement the autoloadback referenced in loki constructor
// function databaseInitialize() {
//   let items = db.getCollection('items');
//   if (items === null) {
//     items = db.addCollection('items', { unique: 'itemId' });
//     const data = JSON.parse(fs.readFileSync(`${__dirname}/data/books.json`, 'utf8'));
//     data.forEach(item =>
//       items.insert({
//         itemId: item.itemId,
//         title: item.title,
//         description: item.description,
//         count: item.count,
//         price: item.price,
//         image: item.image,
//         target: item.target,
//       }));
//   }
// }
// TODO: use sequelize
const db = new sqlite3.Database('/tmp/sample.db');
const createSql = `CREATE TABLE IF NOT EXISTS items (
 itemId TEXT PRIMARY KEY,
 title TEXT NOT NULL,
 description TEXT,
 count INTEGER,
 price INTEGER,
 image TEXT,
 target TEXT
);`;
// db.run(createSql);
const data = JSON.parse(fs.readFileSync(`${__dirname}/data/books.json`, 'utf8'));
// data.forEach(item => {
//   db.run(
//     `INSERT INTO items(item_id, title, description, count, price, image, target)
//     VALUES (?, ?, ?, ?, ?, ?, ?)`,
//     [
//       item.itemId,
//       item.title,
//       item.description,
//       item.count,
//       item.price,
//       item.image,
//       item.target,
//     ]
//   )
//   console.log('wtf');
// });

// const sql = 'SELECT * from items;';
// const rows = [];
// db.each(sql, [], (err, row) => {
//   console.log(row);
//   rows.push(row);
// });
// console.log('#####', rows);


/* END LOAD SAMPLE DATA */

/* CONFIGURE OAUTH2/JWT PASSPORT STRATEGY */
const Strategy = require('passport-oauth2-jwt-bearer').Strategy;

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
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.static('dist'));

// app.get('/api/promos',
//   function (req, res) {
//     const results = promos.chain().find({'target' : 'PUBLIC'}).data();
//     res.json(results);
//   }
// );

app.get(
  '/api/promos',
  passport.authenticate('oauth2-jwt-bearer', { session: false, scopes: ['promos:read'] }),
  (req, res) => {
    const results = promos.chain().find({ target: { $in: ['PUBLIC', 'PREMIUM'] } }).data();
    res.json(results);
  }
);


app.get(
  '/api/items',
  (req, res) => {
    const sql = 'SELECT * from items';
    db.all(sql, [], (err, rows) => res.json(rows));
  }
);

const apiUrl = new URL(process.env.API_URL);
app.listen(apiUrl.port || '8080', () => console.log(`Listening on port ${apiUrl.port}!`));
