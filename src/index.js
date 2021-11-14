// connecting .env file to process.env
require('dotenv').config();

// import dependencies
const express = require('express');
const cors = require('cors');

// import local dependencies
require('./utils/error-handler');

// initialize express app
const app = express();

// use middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup routes
require('./routes/index')({ app });

// run server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`odata server is listening on port: ${port}`);
});