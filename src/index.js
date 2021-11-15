// connecting .env file to process.env
require('dotenv').config();

const config = require('./config/config');
if (config.auth) {
    if (typeof config.apiAuthKey !== 'string' || config.apiAuthKey.trim() === '') {
        throw new Error(`'API_AUTH_KEY' should have a string value in .env file when 'AUTH' value is 'true'`);
    }
}

// import dependencies
const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');

// import local dependencies
require('./utils/error-handler');
const { authenticateRequest } = require('./utils/middlewares');

// initialize express app
const app = express();

// use middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(authenticateRequest);

// initialize cache
const appCache = new NodeCache({ stdTTL: config.stdTTL });

// setup routes
require('./routes/index')({ app, appCache });

// run server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`odata server is listening on port: ${port}`);
});