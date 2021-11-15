// connecting .env file to process.env
require('dotenv').config();

const { auth, apiAuthKey } = require('./config/config');
if (auth) {
    if (typeof apiAuthKey !== 'string' || apiAuthKey.trim() === '') {
        throw new Error(`'API_AUTH_KEY' should have a string value in .env file when 'AUTH' value is 'true'`);
    }
}

// import dependencies
const express = require('express');
const cors = require('cors');

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

// setup routes
require('./routes/index')({ app });

// run server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`odata server is listening on port: ${port}`);
});