module.exports = ({ app }) => {
    app.get('/', (req, res) => {
        res.send('response from odata');
    });

    require('./people.route')({ app });
};