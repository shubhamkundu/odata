module.exports = ({ app, appCache }) => {
    app.get('/', (req, res) => {
        res.send('response from odata');
    });

    const service = require('./../services/index')({ appCache });

    require('./people.route')({ app, service });
};