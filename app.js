// Requiring / importing "dotenv" config to allow access to .env file
require('dotenv').config();

// Declare variable to use Express function
const Express = require('express');

// Declare other essential packages
const Cors = require('cors');
const port = process.env.DEV_PORT || process.env.PROD_PORT;

// Declare app variable to allow in creating other essential functions
const app = Express();
const { connection } = require('./database/connection');

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

/**
 * Enable CORS
 * Cross-Origin Resource Sharing (CORS) is
 * an HTTP-header based mechanism that allows a server
 * to indicate any origins (domain, scheme, or port)
 * other than its own from which a browser should permit loading resources.
 */
app.use(Cors({ origin: '*' }));

const fidyahCalculatorRoute = require('./modules/fidyahCalculator/routers.js');

app.use('/api/palugada/fidyah', fidyahCalculatorRoute);

// Declare a function to check API is online or offline
app.all('*', (_, res) => {
  return res.status(200).send({
    code: 200,
    statustext: 'OK',
    success: true,
    message: 'Connected, welcome to API Fidyah-Ku.'
  });
});

const connectDb = new Promise((resolve) => {
  resolve(connection());
});

connectDb.catch((error) => {
  throw 'Error connecting to database, message' + error;
});

app.listen(port);
// -----------------------
