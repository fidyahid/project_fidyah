// Requiring / importing "dotenv" config to allow access to .env file
require('dotenv').config();
const { Client } = require('pg');

const port = process.env.DEV_PORT || process.env.PROD_PORT;
const DBConfig = require('../config/dbConfig');
const env = process.env.NODE_ENV || 'development';

const { username: user, password, database, host } = DBConfig[env];
const client = new Client({ user, password, host, database });

const connection = async (env) => {
  try {
    await client.connect();
    console.log('DB connected and server start on ' + port);
  } catch (error) {
    client.end((err) => {
      if (err) console.error('error during disconnection', err.stack);
      console.log('client has disconnected');
    });
    console.error('connection error', error.stack);
  }
};
module.exports = { connection, client };
